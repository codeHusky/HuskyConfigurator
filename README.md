# HuskyConfigurator
Configuration Utility for HuskyCrates

# Demo
Click [here](https://codehusky.github.io/HuskyConfigurator/src/main/resources/static/) for a NON-FUNCTIONAL DEMO of HuskyConfigurator.

# How to use
- Download the latest build from [releases](https://github.com/codeHusky/HuskyConfigurator/releases)
- (Optional) Place the jar file within your server's `/mods` folders (where you put plugins)
  - Placing the application within your `/config/huskycrates` folder will do the same thing.
- Simply double-click to open the jar file. The webpage will automatically launch!
- Click Save when you're done making changes. If you don't, your changes will be lost.
Placing HuskyConfigurator within your config/mods folder allows the application to overwrite your config easily, without requiring you to move a file to the config folder. Exiting the website's tab (or reloading) will disconnect the website from the app and close the Java application.

# How to build??
You need to include several dependencies inside the jar file for this to work properly. You'll need to do this in your IDE.

Below is my Artifact I use to build HuskyConfigurator. Feel free to use it when your contributing. Made in IntelliJ Idea.
```
<component name="ArtifactManager">
  <artifact type="jar" name="HuskyConfigurator:jar">
    <output-path>$PROJECT_DIR$/../Test Servers/Secondary/mods</output-path>
    <root id="archive" name="HuskyConfigurator.jar">
      <element id="module-output" name="HuskyConfigurator" />
      <element id="directory" name="META-INF">
        <element id="file-copy" path="$PROJECT_DIR$/HuskyConfigurator/META-INF/MANIFEST.MF" />
      </element>
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/com/corundumstudio/socketio/netty-socketio/1.7.12/netty-socketio-1.7.12.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/org/slf4j/slf4j-api/1.7.25/slf4j-api-1.7.25.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/io/netty/netty-buffer/4.1.5.Final/netty-buffer-4.1.5.Final.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/io/netty/netty-codec-http/4.1.5.Final/netty-codec-http-4.1.5.Final.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/io/netty/netty-codec/4.1.5.Final/netty-codec-4.1.5.Final.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/io/netty/netty-common/4.1.5.Final/netty-common-4.1.5.Final.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/io/netty/netty-handler/4.1.5.Final/netty-handler-4.1.5.Final.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/io/netty/netty-resolver/4.1.5.Final/netty-resolver-4.1.5.Final.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/io/netty/netty-transport-native-epoll/4.1.5.Final/netty-transport-native-epoll-4.1.5.Final.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/io/netty/netty-transport/4.1.5.Final/netty-transport-4.1.5.Final.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/com/fasterxml/jackson/core/jackson-annotations/2.7.0/jackson-annotations-2.7.0.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/com/fasterxml/jackson/core/jackson-core/2.7.4/jackson-core-2.7.4.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/com/fasterxml/jackson/core/jackson-databind/2.7.4/jackson-databind-2.7.4.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/com/google/guava/guava/21.0/guava-21.0.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/ninja/leaping/configurate/configurate-hocon/3.3/configurate-hocon-3.3.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/ninja/leaping/configurate/configurate-core/3.3/configurate-core-3.3.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/com/typesafe/config/1.3.1/config-1.3.1.jar" path-in-jar="/" />
      <element id="extracted-dir" path="$MAVEN_REPOSITORY$/ninja/leaping/configurate/configurate-json/3.3/configurate-json-3.3.jar" path-in-jar="/" />
    </root>
  </artifact>
</component>
```

# It isn't working right! Help!
If you're having problems, feel free to join [the support discord](https://discord.gg/FSETtcx) or, if you know it is a bug, post an issue on GitHub.
