$env:JAVA_HOME = "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.0.1\jbr"
$baseDir = Get-Location
& "$env:JAVA_HOME\bin\java.exe" "-Dmaven.multiModuleProjectDirectory=$baseDir" -classpath "$baseDir\.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain $args
