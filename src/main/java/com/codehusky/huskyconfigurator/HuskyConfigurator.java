package com.codehusky.huskyconfigurator;

import com.codehusky.huskyconfigurator.events.StringEvent;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
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

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

public class HuskyConfigurator extends JPanel implements ActionListener {
    private static boolean live = true;
    private static boolean connectionMade = false;
    private static long startTime = System.currentTimeMillis();
    private static ConfigurationLoader<CommentedConfigurationNode> loader = null;
    private static String configStr = "{}";
    static private final String newline = "\n";
    JButton openButton, loadButton;
    JFileChooser fc;
    public HuskyConfigurator() {
        super();
        //setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
        //Create a file chooser
        fc = new JFileChooser();
        fc.setFileFilter(new FileNameExtensionFilter("HuskyCrates Configurations (.conf)","conf"));

        //Uncomment one of the following lines to try a different
        //file selection mode.  The first allows just directories
        //to be selected (and, at least in the Java look and feel,
        //shown).  The second allows both files and directories
        //to be selected.  If you leave these lines commented out,
        //then the default mode (FILES_ONLY) will be used.
        //
        //fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);

        //Create the open button.  We use the image from the JLF
        //Graphics Repository (but we extracted it from the jar).
        openButton = new JButton("Open config file...");
        openButton.addActionListener(this);

        //Create the save button.  We use the image from the JLF
        //Graphics Repository (but we extracted it from the jar).
        loadButton = new JButton("Load!");
        loadButton.addActionListener(this);

        JLabel label = new JLabel("Do NOT close this menu until you're done.");
        label.setHorizontalAlignment(SwingConstants.CENTER);
        JLabel label2 = new JLabel("If you do, you will lose your changes.");
        label2.setHorizontalAlignment(SwingConstants.CENTER);
        JPanel warningPanel = new JPanel();
        warningPanel.setLayout(new BoxLayout(warningPanel, BoxLayout.Y_AXIS));
        warningPanel.add(label);
        warningPanel.add(label2);
        //For layout purposes, put the buttons in a separate panel
        JPanel buttonPanel = new JPanel(); //use FlowLayout
        buttonPanel.add(openButton);
        buttonPanel.add(loadButton);

        //Add the buttons and the log to this panel.
        add(buttonPanel, BorderLayout.BEFORE_FIRST_LINE);
        add(warningPanel, BorderLayout.CENTER);
    }
    public ConfigurationLoader<CommentedConfigurationNode> crateConfigLoader;
    //public ConfigurationLoader<CommentedConfigurationNode> crateConvertedLoader;
    public CommentedConfigurationNode crateConfig;
    public CommentedConfigurationNode convertedCrateConfig;
    public void actionPerformed(ActionEvent e) {

        //Handle open button action.
        if (e.getSource() == openButton) {
            int returnVal = fc.showOpenDialog(HuskyConfigurator.this);

            if (returnVal == JFileChooser.APPROVE_OPTION) {
                File file = fc.getSelectedFile();
                /*crateConfigLoader = HoconConfigurationLoader.builder().setFile(file).build();
                //crateConvertedLoader = HoconConfigurationLoader.builder().setFile(new File(file.getPath().replace(file.getName(),"") + "crates.converted.conf")).build();
                try {
                    crateConfig = crateConfigLoader.load();
                    //log.setText("-- File ready --\n\n");
                } catch (IOException e1) {
                    JOptionPane.showMessageDialog(null,e1.getMessage(),"Failure!",JOptionPane.ERROR_MESSAGE);
                }*/
                createJSONConfig(file.toPath());
            }

            //Handle load button action.
        } else if (e.getSource() == loadButton) {
            int input = JOptionPane.showConfirmDialog(null, "Are you sure you want to load?\n\nYou will lose ALL unsaved changes in HuskyConfigurator.");
            if(input == 0) {
                server.getAllClients().forEach(client -> {
                    client.sendEvent("configData", configStr);
                });
            }
        }
    }

    /** Returns an ImageIcon, or null if the path was invalid. */
    protected static ImageIcon createImageIcon(String path) {
        java.net.URL imgURL = HuskyConfigurator.class.getResource(path);
        if (imgURL != null) {
            return new ImageIcon(imgURL);
        } else {
            System.err.println("Couldn't find file: " + path);
            return null;
        }
    }

    /**
     * Create the GUI and show it.  For thread safety,
     * this method should be invoked from the
     * event dispatch thread.
     */
    private static void createAndShowGUI() {
        //Create and set up the window.
        JFrame frame = new JFrame("HuskyConfigurator Backend");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        //Add content to the window.
        frame.add(new HuskyConfigurator());

        //Display the window.
        frame.pack();
        frame.setSize(400,200);
        frame.setResizable(false);
        frame.setVisible(true);
        frame.setLocationRelativeTo(null);
    }

    public static void printFailure(Exception e){
        StringWriter str = new StringWriter();
        PrintWriter pw = new PrintWriter(str);
        e.printStackTrace(pw);

        try {
            BufferedWriter writer = new BufferedWriter(
                    new FileWriter("error.log", true)  //Set true for append mode
            );

            writer.newLine();
            writer.newLine();
            writer.write("--- Exception generated @ "+ (new Date()).toString() + " ---");
            writer.newLine();
            writer.write("--- Error is below... ---");
            writer.newLine();
            writer.newLine();
            writer.write(str.toString());
            writer.newLine();
            writer.write("--- Error is above... ---");
            writer.newLine();
            writer.write("--- Exception generated @ "+ (new Date()).toString() + " ---");
            writer.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        String smallStr = str.toString().substring(0, Math.min(500,str.toString().length()));
        if(smallStr.length() < str.toString().length()){
            smallStr+="...";
        }
        JOptionPane.showMessageDialog(null,smallStr + "\n\nPlease check error.log for more information.\nFor support, go to the codeHusky Discord: https://discord.gg/FSETtcx","Failure!",JOptionPane.ERROR_MESSAGE);
    }
    public static void createJSONConfig(Path goal){
        if (goal.toFile().exists()){
            if(goal.toFile().length() > 0) {
                HoconConfigurationLoader m_loader = HoconConfigurationLoader.builder().setHeaderMode(HeaderMode.PRESET).setPath(goal).build();
                //loader.load();
                JSONConfigurationLoader jsonloader = JSONConfigurationLoader.builder().build();
                StringWriter writer = new StringWriter();
                try {
                    try {
                        jsonloader.saveInternal(m_loader.load(), writer);
                        configStr = writer.toString();
                        System.out.println(configStr);
                    }catch(NullPointerException e){
                        System.out.println("Warning: Failed to turn config to JSON!");
                        printFailure(e);
                        configStr = "{}";
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    printFailure(e);
                }
                System.out.println("Loaded.");
            }else{
                configStr = "{}";
            }
        }
    }
    public static SocketIOServer server;
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

        createJSONConfig(goal);
        // = HoconConfigurationLoader.builder().setPath(conf.toPath()).build();

        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(args.length == 0 || args[0].replaceAll("[^0-9]", "").isEmpty() ? 46544 : Integer.parseInt(args[0].replaceAll("[^0-9]", "")));

        server = new SocketIOServer(config);

        server.addConnectListener(socketIOClient -> {
            socketIOClient.sendEvent("configData",configStr);
            System.out.println("Connected");
            connectionMade = true;
        });

        server.addDisconnectListener(socketIOClient -> {
            if(server.getAllClients().size() == 0) {
                live = false;
            }
        });

        server.addEventListener("saveConfigData", StringEvent.class, (socketIOClient, stringEvent, ackRequest) -> {
            System.out.println("????");
            try {
                InputStream read = new ByteArrayInputStream(stringEvent.getData().getBytes());
                BufferedReader bReader = new BufferedReader(new InputStreamReader(read));
                loader.save(JSONConfigurationLoader.builder().setHeaderMode(HeaderMode.PRESET).setSource(() -> bReader).build().load());
            }catch(Exception e){
                printFailure(e);
                e.printStackTrace();
                return;
            }
            socketIOClient.sendEvent("configDataSaved");
            System.out.println("saved");
            JOptionPane.showMessageDialog(null, "Config saved at " + new Date().toString() + ".");
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
            printFailure(e);
        }
        if (Desktop.isDesktopSupported()) {
            try {
                Desktop.getDesktop().browse(new URI("http://localhost:46545"));
            } catch (Exception e) {
                e.printStackTrace();
                printFailure(e);
            }
        }else {
            try {
                JFrameJunk.main();
            } catch (Exception e) {
                e.printStackTrace();
                printFailure(e);
            }
        }
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                //Turn off metal's use of bold fonts
                UIManager.put("swing.boldMetal", Boolean.FALSE);
                createAndShowGUI();
            }
        });
        while(live){
            Thread.sleep(1);
        }
        System.out.println("DED");
        server.stop();
        httpServ.stop(1);
    }

}
