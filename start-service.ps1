param(
  [int]$Port = 8000
)

$root = $PSScriptRoot
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
$isWindowsAppAlias = $pythonCommand -and $pythonCommand.Source -match '(?i)[\\/]WindowsApps[\\/]python(?:3)?\.exe$'
if ($pythonCommand -and -not $isWindowsAppAlias) {
  Push-Location $root
  try {
    & $pythonCommand.Source server.py
    exit $LASTEXITCODE
  } finally {
    Pop-Location
  }
}
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
      $stream.ReadTimeout = 5000
      $stream.WriteTimeout = 10000
      $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = $reader.ReadLine()
      while ($reader.ReadLine()) { }

      if ($requestLine -notmatch '^GET\s+([^\s?]+)') { $requestPath = $null } else { $requestPath = [Uri]::UnescapeDataString($Matches[1].TrimStart('/')) }
      if ([string]::IsNullOrWhiteSpace($requestPath)) { $requestPath = 'index.html' }
      elseif ($requestPath.EndsWith('/')) { $requestPath = "${requestPath}index.html" }

      if ($requestPath -eq 'api/upcoming-events') {
        $upcomingFolder = Join-Path $root 'assets/upcoming'
        $eventsFile = Join-Path $upcomingFolder 'events.json'
        $upcomingManifest = Join-Path $upcomingFolder 'manifest.json'
        $eventsJson = if (Test-Path -LiteralPath $eventsFile -PathType Leaf) { [IO.File]::ReadAllText($eventsFile, [Text.Encoding]::UTF8) } else { '[]' }
        $postersJson = if (Test-Path -LiteralPath $upcomingManifest -PathType Leaf) {
          [IO.File]::ReadAllText($upcomingManifest, [Text.Encoding]::UTF8)
        } elseif (Test-Path -LiteralPath $upcomingFolder -PathType Container) {
          $slides = @(
          Get-ChildItem -LiteralPath $upcomingFolder -File | Where-Object { $_.Extension -match '^\.(png|jpe?g|webp)$' } | Sort-Object Name | ForEach-Object { "assets/upcoming/$([Uri]::EscapeDataString($_.Name))" }
          )
          ConvertTo-Json -InputObject @($slides) -Compress
        } else { '[]' }
        $payload = '{"events":' + $eventsJson + ',"posters":' + $postersJson + '}'
        $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
        $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-store, no-cache, must-revalidate, max-age=0`r`nConnection: close`r`n`r`n"
        $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        $stream.Write($bytes, 0, $bytes.Length)
        continue
      }
      if ($requestPath -eq 'api/gallery') {
        $galleryFolder = Join-Path $root 'assets/gallery'
        $galleryManifest = Join-Path $galleryFolder 'manifest.json'
        if (Test-Path -LiteralPath $galleryManifest -PathType Leaf) {
          $bytes = [IO.File]::ReadAllBytes($galleryManifest)
          $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
          $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
          $stream.Write($headerBytes, 0, $headerBytes.Length)
          $stream.Write($bytes, 0, $bytes.Length)
          continue
        }
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
            'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36'
            'Accept-Language' = 'en-US,en;q=0.9'
            'Accept' = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
          $pageContent = (Invoke-WebRequest -Uri $streamsUrl -UseBasicParsing -Headers $youtubeHeaders -TimeoutSec 30).Content
          $seenVideoIds = New-Object 'System.Collections.Generic.HashSet[string]'
          $videos = @()
          $blocks = $pageContent -split '"lockupViewModel":'
          foreach ($block in ($blocks | Select-Object -Skip 1)) {
            $idMatch = [regex]::Match($block, '"contentId":"([a-zA-Z0-9_-]{11})"')
            if (-not $idMatch.Success -or -not $seenVideoIds.Add($idMatch.Groups[1].Value)) { continue }
            $titleMatch = [regex]::Match($block.Substring(0, [Math]::Min($block.Length, 40000)), '"content":"([^"\\]*(?:\\.[^"\\]*)*)"')
            $title = if ($titleMatch.Success) { ConvertFrom-Json ('"' + $titleMatch.Groups[1].Value + '"') } else { $null }
            if ([string]::IsNullOrWhiteSpace($title)) { $title = if (-not $videos.Count) { 'Latest Live Service' } else { 'Previous Live Service' } }
            $videoId = $idMatch.Groups[1].Value
            $videos += [pscustomobject]@{ id = $videoId; title = $title; published = ''; url = "https://www.youtube.com/watch?v=$videoId"; thumbnail = "https://i.ytimg.com/vi/$videoId/hqdefault.jpg" }
            if ($videos.Count -eq 9) { break }
          }
          if (-not $videos.Count) { throw 'No videos were found on the YouTube Live tab.' }
          $json = ConvertTo-Json -InputObject @($videos) -Compress
          $bytes = [Text.Encoding]::UTF8.GetBytes($json)
          $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
        }
        catch {
          # The Live page uses its YouTube uploads-playlist fallback when no
          # fresh API results are available. Keep that fallback reachable
          # without turning a temporary upstream failure into a server error.
          $bytes = [Text.Encoding]::UTF8.GetBytes('[]')
          $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
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
        $cacheHeader = if ($requestPath.EndsWith('.html') -or $requestPath -in @('admin/index.html', 'admin/admin.css', 'js/admin.js', 'js/script.js', 'js/events.js', 'styles.css', 'design-system.css', 'app-theme.css', 'assets/upcoming/events.json', 'assets/upcoming/manifest.json', 'assets/backgrounds/manifest.json', 'assets/pastor/manifest.json')) {
          "Cache-Control: no-store, no-cache, must-revalidate, max-age=0`r`nPragma: no-cache`r`nExpires: 0`r`n"
        } else { '' }
        $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`n${cacheHeader}Connection: close`r`n`r`n"
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
