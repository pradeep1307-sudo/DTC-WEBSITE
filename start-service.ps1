param(
  [int]$Port = 8000
)

$root = $PSScriptRoot
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
Write-Host "Denver Tamil Church is running at http://localhost:$Port"

$mimeTypes = @{
  '.css' = 'text/css; charset=utf-8'; '.html' = 'text/html; charset=utf-8'
  '.ico' = 'image/x-icon'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.js' = 'application/javascript; charset=utf-8'; '.json' = 'application/json; charset=utf-8'
  '.png' = 'image/png'; '.svg' = 'image/svg+xml'; '.webp' = 'image/webp'
}

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = $reader.ReadLine()
      while ($reader.ReadLine()) { }

      if ($requestLine -notmatch '^GET\s+([^\s?]+)') { $requestPath = $null } else { $requestPath = [Uri]::UnescapeDataString($Matches[1].TrimStart('/')) }
      if ([string]::IsNullOrWhiteSpace($requestPath)) { $requestPath = 'index.html' }

      if ($requestPath -eq 'api/upcoming-events') {
        $upcomingFolder = Join-Path $root 'assets/upcoming'
        $slides = if (Test-Path -LiteralPath $upcomingFolder -PathType Container) {
          Get-ChildItem -LiteralPath $upcomingFolder -File | Where-Object { $_.Extension -match '^\.(png|jpe?g|webp)$' } | Sort-Object Name | ForEach-Object { "assets/upcoming/$([Uri]::EscapeDataString($_.Name))" }
        } else { @() }
        $slideItems = @($slides | ForEach-Object { '"' + ($_ -replace '\\', '\\\\' -replace '"', '\\"') + '"' })
        $slidesJson = '[' + [string]::Join(',', $slideItems) + ']'
        $bytes = [Text.Encoding]::UTF8.GetBytes($slidesJson)
        $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
        $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        $stream.Write($bytes, 0, $bytes.Length)
        continue
      }
      if ($requestPath -eq 'api/gallery') {
        $galleryFolder = Join-Path $root 'assets/gallery'
        $albumItems = @()
        if (Test-Path -LiteralPath $galleryFolder -PathType Container) {
          $albumItems = @(Get-ChildItem -LiteralPath $galleryFolder -Directory | Sort-Object Name | ForEach-Object {
            $folder = $_
            $albumName = (Get-Culture).TextInfo.ToTitleCase(($folder.Name -replace '-', ' '))
            $escapedName = $albumName.Replace('\', '\\').Replace('"', '\"')
            $escapedSlug = $folder.Name.Replace('\', '\\').Replace('"', '\"')
            $imageItems = @(Get-ChildItem -LiteralPath $folder.FullName -File | Where-Object { $_.Extension -match '^\.(png|jpe?g|webp)$' } | Sort-Object Name | ForEach-Object {
              $imagePath = "assets/gallery/$([Uri]::EscapeDataString($folder.Name))/$([Uri]::EscapeDataString($_.Name))"
              '"' + $imagePath.Replace('\', '\\').Replace('"', '\"') + '"'
            })
            '{"slug":"' + $escapedSlug + '","name":"' + $escapedName + '","images":[' + [string]::Join(',', $imageItems) + ']}'
          })
        }
        $galleryJson = '[' + [string]::Join(',', $albumItems) + ']'
        $bytes = [Text.Encoding]::UTF8.GetBytes($galleryJson)
        $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
        $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        $stream.Write($bytes, 0, $bytes.Length)
        continue
      }
      if ($requestPath -eq 'api/youtube-videos') {
        try {
          $feedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNPyD_nYVLhC5-47771aGdw'
          [xml]$feed = (Invoke-WebRequest -Uri $feedUrl -UseBasicParsing -TimeoutSec 12).Content
          $cutoff = [DateTimeOffset]::UtcNow.AddDays(-60)
          $videoItems = @($feed.SelectNodes("/*[local-name()='feed']/*[local-name()='entry']") | ForEach-Object {
            $publishedNode = $_.SelectSingleNode("*[local-name()='published']")
            $videoIdNode = $_.SelectSingleNode("*[local-name()='videoId']")
            $titleNode = $_.SelectSingleNode("*[local-name()='title']")
            $published = [DateTimeOffset]::Parse($publishedNode.InnerText)
            if ($published -ge $cutoff -and $titleNode.InnerText -match '(?i)sunday service') {
              $videoId = $videoIdNode.InnerText
              $escapedTitle = $titleNode.InnerText.Replace('\', '\\').Replace('"', '\"').Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t')
              '{"id":"' + $videoId + '","title":"' + $escapedTitle + '","published":"' + $published.ToString('o') + '","url":"https://www.youtube.com/watch?v=' + $videoId + '","thumbnail":"https://img.youtube.com/vi/' + $videoId + '/hqdefault.jpg"}'
            }
          })
          $json = '[' + [string]::Join(',', $videoItems) + ']'
          $bytes = [Text.Encoding]::UTF8.GetBytes($json)
          $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
        }
        catch {
          $bytes = [Text.Encoding]::UTF8.GetBytes('{"error":"Video feed unavailable"}')
          $header = "HTTP/1.1 502 Bad Gateway`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
        }
        $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        $stream.Write($bytes, 0, $bytes.Length)
        continue
      }
      $candidate = [IO.Path]::GetFullPath((Join-Path $root $requestPath))
      $isValid = $candidate.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path -LiteralPath $candidate -PathType Leaf)

      if ($isValid) {
        $bytes = [IO.File]::ReadAllBytes($candidate)
        $extension = [IO.Path]::GetExtension($candidate).ToLowerInvariant()
        $contentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { 'application/octet-stream' }
        $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
      } else {
        $bytes = [Text.Encoding]::UTF8.GetBytes('Not found')
        $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
      }
      $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      $stream.Write($bytes, 0, $bytes.Length)
    }
    catch {
      # Browsers may cancel speculative requests; keep the local server alive.
      Write-Verbose "Request ended early: $($_.Exception.Message)"
    }
    finally { $client.Close() }
  }
}
finally { $listener.Stop() }
