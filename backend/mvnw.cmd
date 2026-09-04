@echo off
set "JAVA_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.0.1\jbr"
"%JAVA_HOME%\bin\java.exe" -Dmaven.multiModuleProjectDirectory="%~dp0" -classpath "%~dp0.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
