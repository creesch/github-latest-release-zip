# Download Latest Release Zip

A Github action that downloads the latest release zip from another repository for use in other subsequent actions. 

## Input

Name | Description | Example
--- | --- | ---
owner | The Github user or organization that owns the repository |  creesch
repo | The repository name | github-latest-release-zip
downloadPath | Path where the zip needs to be save. Should only be directories and not end in a filename | github-latest-release-zip

## Output 

Name | Description 
--- | --- 
filename | Name of the downloaded zip file 
name | Name of the release
tag_name | Tag for the release
body | Markdown body for the release on the github release page
html_url | Url to the github release page

The file itself will be written to the given input path
