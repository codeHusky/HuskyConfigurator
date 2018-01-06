package com.codehusky.huskyconfigurator;

import com.codehusky.huskyconfigurator.events.StringEvent;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import com.google.common.io.ByteStreams;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import ninja.leaping.configurate.commented.CommentedConfigurationNode;
import ninja.leaping.configurate.hocon.HoconConfigurationLoader;
import ninja.leaping.configurate.json.JSONConfigurationLoader;
import ninja.leaping.configurate.loader.ConfigurationLoader;
import ninja.leaping.configurate.loader.HeaderMode;

import java.awt.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.Callable;

public class HuskyConfigurator {
    private static boolean live = true;
    private static boolean connectionMade = false;
    private static long startTime = System.currentTimeMillis();
    private static ConfigurationLoader<CommentedConfigurationNode> loader = null;
    private static String configStr = "{}";
    public static void main(String[] args) throws InterruptedException {

        Path currentDir = Paths.get(".").toAbsolutePath().normalize();
        Path goal = null;
        if (currentDir.getName(currentDir.getNameCount() - 1).toString().equals("mods")) {
            goal = Paths.get("../config/huskycrates/huskycrates.conf");
            File potentialConf = new File(goal.toString());
            if (potentialConf.exists()) {
                loader = HoconConfigurationLoader.builder().setHeaderMode(HeaderMode.PRESET).setFile(potentialConf).build();
            }
        }
        //String configStr = "{}";
        if (loader == null) {
            goal = Paths.get("huskycrates.conf");
            loader = HoconConfigurationLoader.builder().setHeaderMode(HeaderMode.PRESET).setPath(goal).build();
        }
        if (goal.toFile().exists()){
            if(goal.toFile().length() > 0) {
                //loader.load();
                JSONConfigurationLoader jsonloader = JSONConfigurationLoader.builder().build();
                StringWriter writer = new StringWriter();
                try {
                    jsonloader.saveInternal(loader.load(), writer);
                    configStr = writer.toString();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        // = HoconConfigurationLoader.builder().setPath(conf.toPath()).build();

        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(46544);

        SocketIOServer server = new SocketIOServer(config);
        server.addConnectListener(socketIOClient -> {
            socketIOClient.sendEvent("configData",configStr);
            System.out.println("Connected");
            connectionMade = true;
        });

        server.addDisconnectListener(socketIOClient -> live = false);

        server.addEventListener("saveConfigData", StringEvent.class, (socketIOClient, stringEvent, ackRequest) -> {
            System.out.println("????");
            try {
                InputStream read = new ByteArrayInputStream(stringEvent.getData().getBytes());
                BufferedReader bReader = new BufferedReader(new InputStreamReader(read));
                loader.save(JSONConfigurationLoader.builder().setHeaderMode(HeaderMode.PRESET).setSource(() -> bReader).build().load());
            }catch(Exception e){
                e.printStackTrace();
            }
            socketIOClient.sendEvent("configDataSaved");
            System.out.println("saved");
        });


        server.start();

        HttpServer httpServ = null;
        try {
            httpServ = HttpServer.create(new InetSocketAddress(46545), 0);

            httpServ.createContext("/", new HttpHandler() {
                @Override
                public void handle(HttpExchange ex) throws IOException {
                    URI uri = ex.getRequestURI();
                    String name = new File(uri.getPath()).getName();
                    InputStream path = null;

                    if(!name.equals("")) {
                        path = this.getClass().getClassLoader().getResourceAsStream("static/" + name);
                    } else {
                        path = this.getClass().getClassLoader().getResourceAsStream("static/index.html");
                    }

                    Headers h = ex.getResponseHeaders();
                    // Could be more clever about the content type based on the filename here.
                    //h.add("Content-Type", "text/html");

                    OutputStream out = ex.getResponseBody();
                    byte[] data = ByteStreams.toByteArray(path);
                    if (data.length > 0) {
                        ex.sendResponseHeaders(200, 0);
                        out.write(data);
                    } else {
                        System.err.println("File not found: " + name);

                        ex.sendResponseHeaders(404, 0);
                        out.write("404 File not found.".getBytes());
                    }

                    out.close();
                }
            });

            httpServ.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (Desktop.isDesktopSupported()) {
            try {
                Desktop.getDesktop().browse(new URI("http://localhost:46545"));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }else {
            try {
                JFrameJunk.main();
            } catch (Exception eek) {
                eek.printStackTrace();

            }
        }

        while(live){
            // woo
            if(!connectionMade) {
                if (System.currentTimeMillis() > startTime + 1000 * 10) { //10 seconds
                    live = false;
                    System.out.println("Connection timed out.");
                }
            }
            Thread.sleep(1);
        }
        System.out.println("DED");
        server.stop();
        httpServ.stop(1);
    }

}
