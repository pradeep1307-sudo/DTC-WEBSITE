param(
  [int]$Port = 8000
)

$root = $PSScriptRoot
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
try {
  $listener.Start()
} catch [System.Net.Sockets.SocketException] {
  Write-Error "Port $Port is already in use. Denver Tamil Church may already be running at http://localhost:$Port"
  exit 1
}
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
          $streamsUrl = 'https://www.youtube.com/@TamilChurchDenver/streams'
          $youtubeHeaders = @{
            'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36'
            'Accept-Language' = 'en-US,en;q=0.9'
          }
          $pageContent = (Invoke-WebRequest -Uri $streamsUrl -UseBasicParsing -Headers $youtubeHeaders -TimeoutSec 30).Content
          $lockupPositions = @([regex]::Matches($pageContent, '"lockupViewModel":') | ForEach-Object { $_.Index })
          $cutoff = [DateTime]::UtcNow.AddDays(-60).Date
          $parsedVideos = @()
          for ($index = 0; $index -lt $lockupPositions.Count; $index += 1) {
            $start = $lockupPositions[$index]
            $end = if ($index + 1 -lt $lockupPositions.Count) { $lockupPositions[$index + 1] } else { [Math]::Min($pageContent.Length, $start + 30000) }
            $lockup = $pageContent.Substring($start, $end - $start)
            $idMatch = [regex]::Match($lockup, '"contentId":"([a-zA-Z0-9_-]{11})"')
            if (-not $idMatch.Success) { continue }
            $title = @([regex]::Matches($lockup, '"content":"([^"\\]*(?:\\.[^"\\]*)*)"') | ForEach-Object { $_.Groups[1].Value }) |
              Where-Object { $_ -match '(?i)Sunday Service' } | Select-Object -First 1
            if ([string]::IsNullOrWhiteSpace($title)) { continue }
            $dateMatch = [regex]::Match($title, '(?i)(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})\s+(\d{4})')
            if (-not $dateMatch.Success) { continue }
            $published = [DateTime]::Parse($dateMatch.Value, [Globalization.CultureInfo]::InvariantCulture)
            if ($published.Date -lt $cutoff) { continue }
            $parsedVideos += [pscustomobject]@{ Id = $idMatch.Groups[1].Value; Title = $title; Published = $published }
          }
          $videoItems = @($parsedVideos | Sort-Object Published -Descending | Group-Object Id | ForEach-Object {
            $video = $_.Group[0]
            $escapedTitle = $video.Title.Replace('\', '\\').Replace('"', '\"').Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t')
            '{"id":"' + $video.Id + '","title":"' + $escapedTitle + '","published":"' + $video.Published.ToString('o') + '","url":"https://www.youtube.com/watch?v=' + $video.Id + '","thumbnail":"https://i.ytimg.com/vi/' + $video.Id + '/hqdefault.jpg"}'
          })
          if (-not $videoItems.Count) { throw 'No Sunday services were found on the Streams page.' }
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
