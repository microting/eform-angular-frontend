[cmdletbinding()]
Param(
  [ValidateScript({Test-Path $_})]
  [ValidateNotNullOrEmpty()] 
  [Parameter(Mandatory=$True)]
  [string]$filePath,
  
  [Parameter(Mandatory=$True)]
  [ValidateNotNullOrEmpty()] 
  [string]$version
)

[xml]$xml = Get-Content $filePath

Write-Verbose ("Updating product verion to {0}" -f $version)

$xml.Wix.Product.Version = $version

Write-Verbose ("Saving to file {0}" -f $filePath)
$xml.Save($filePath)