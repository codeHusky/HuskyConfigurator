window.onbeforeunload =function(){
    if(location.protocol.indexOf("file") == -1){
        return true
    }
}
const socket = io("http://localhost:46544");
var config = {"crates":{"sosbasic":{"type":"Roulette","items":[{"lore":["Speakerbox"],"nbt":{"test":{"valueOfCool":55}},"name":"BLAM","huskydata":{"overrideRewardName":"BLAM","rewards":[{"type":"item"}],"weight":1},"damage":3,"formatversion":1,"count":2,"id":"minecraft:planks"},{"formatversion":1,"huskydata":{"weight":3,"rewards":[{"type":"command","command":"smite %p"}]},"count":2,"id":"minecraft:ender_pearl","name":"&bLightning Pearl","lore":["&7Legend has it, just looking at this","&7pearl causes localized lightning."]}],"spinnerOptions":{"maxClicks":50,"dampening":1.025},"options":{"particle1":{"color":[150,150,0]},"crateBlockID":"minecraft:sponge","particle2":{"color":[100,100,0]},"keyID":"minecraft:iron_nugget"},"name":"&eSoS &6XIV &7Basic"},"command":{"type":"Spinner","items":[{"name":"Diamond Box","id":"minecraft:diamond","formatversion":1,"huskydata":{"rewards":[{"type":"command","command":"give %p minecraft:diamond 10"}],"weight":1},"count":1,"type":"Spinner","lore":["10 Minecraft Diamond"]},{"lore":["Speakerbox"],"name":"BLAM","formatversion":1,"id":"minecraft:dirt","count":2,"huskydata":{"overrideRewardName":"BLAM","weight":1,"rewards":[{"type":"command","command":"say %p is a potato."}]}},{"huskydata":{"weight":1,"overrideRewardName":"be a sore loser","rewards":[{"type":"command","command":"crate key command %p"}]},"formatversion":1,"name":"&4be a sore loser","id":"minecraft:stone","count":3,"lore":["try again BOI"]},{"formatversion":1,"id":"minecraft:dirt","name":"trash","huskydata":{"overrideRewardName":"trash","weight":1,"rewards":[{"type":"command","command":"say meh"}]},"count":4,"lore":["10 Minecraft Diamond"]}],"spinnerOptions":{"maxClickModifier":3,"minClickModifier":-3,"maxClicks":100,"dampening":1.025},"name":"&3Command Crate","options":{"keyID":"minecraft:dirt","particle2":{"color":[255,0,255]},"particle1":{"color":[0,255,0]}}},"soscool":{"name":"&eSoS &6XIV &aCool","items":[{"id":"minecraft:stick","name":"&4Bitchin Stick","formatversion":1,"count":1,"huskydata":{"rewards":[{"type":"item"}],"weight":1},"enchants":{"knockback":255,"satan":55}}],"options":{"keyID":"minecraft:gold_nugget","particle1":{"color":[255,255,0]},"crateBlockID":"minecraft:sponge","particle2":{"color":[150,150,0]}},"type":"Spinner","spinnerOptions":{"maxClicks":50,"dampening":1.025}},"sosbattle":{"type":"instant","items":[{"lore":["&bbrr brr brr brr"],"id":"minecraft:stick","formatversion":1,"name":"&3Chill Stick","count":1,"huskydata":{"rewards":[{"type":"item"}],"weight":1}}],"options":{"freeCrate":true,"particle2":{"color":[190,190,0]},"particle1":{"color":[255,72,0]},"crateBlockID":"minecraft:ender_chest","freeCrateDelay":5},"spinnerOptions":{"maxClicks":50,"dampening":1.025},"name":"&aSoS &6XIV &l&cArena","lang":{"rewardMessage":"Have %a &a%R&r!","prefix":"&c&lARENA&r&e>> "}},"fancy":{"name":"&bFancy Cool Crate","type":"Spinner","options":{"particle2":{"color":[255,255,0]},"particle1":{"color":[0,255,0]}},"items":[{"name":"minecraft:diamond","id":"minecraft:diamond","formatversion":1,"count":1,"huskydata":{"rewards":[{"type":"item"}],"weight":5}},{"name":"minecraft:dirt","formatversion":1,"id":"minecraft:dirt","count":15,"huskydata":{"rewards":[{"type":"item"}],"weight":20}},{"formatversion":1,"name":"&3Stoned the Stones","id":"minecraft:cobblestone","lore":["He once was a spooky stones."],"count":1,"huskydata":{"rewards":[{"type":"item"}],"weight":1}},{"formatversion":1,"count":1,"lore":[":)"],"name":"&6Pre-cut wood","huskydata":{"rewards":[{"type":"item"}],"weight":1},"id":"minecraft:planks"},{"formatversion":1,"lore":["idk someone gave it to me"],"id":"minecraft:diamond_sword","count":1,"name":"&cFancy sword","huskydata":{"rewards":[{"type":"item"}],"weight":1}}]}}};
if(location.hostname == "localhost" && location.protocol.indexOf("file") == -1){
    config = {};

}else{
    $("#loading").hide();
    updateUI();
}

socket.on("connect", function() {
    console.log("connection to huskyconfigurator");
    $("#save").click(function() {
        socket.emit("saveConfigData",JSON.stringify(config))
        $("#loadingText").text("Saving...");
        $("#loading").show();
    })
    $("#loading").hide();
})
socket.on("configData",function(data){
    config = JSON.parse(data);
    console.log("JSON config received!")
    updateUI();
})
socket.on("configDataSaved",function(){
    $("#loading").hide();
})
var currentCrate = null;
var currentPage = "crateOverview";
var pages = ["crateOverview","crateItems","crateOptions","crateSpinnerOptions","crateLang","globalLang"];
$("#crates").change(function() {
    triggerCrate($(this).val());
})
$("#newCrate").click(function() {
    $("#newCrateModal").modal('show')
})
var latestItemID = -1;
function launchRewardEditor(itemID){
    latestItemID = itemID;
    $("#newReward").off("click").click(function() {
        config.crates[currentCrate].items[itemID].huskydata.rewards.push({type:"command"})
        updateRewardEditor(itemID);
    })
    updateRewardEditor(itemID);
    $("#editItemRewards").modal("show");
}
function updateRewardEditor(itemID){
    latestItemID = itemID;
    $("#rewardEntries").html("");
    if(config.crates[currentCrate].items[itemID].huskydata.rewards.length == 0){
        config.crates[currentCrate].items[itemID].huskydata.rewards.push({type:"command"})
    }
    for(num in config.crates[currentCrate].items[itemID].huskydata.rewards){
        var rPrefix = "item-" + itemID + "-reward-" + num + "-";
        var rDel = rPrefix + "delete";
        var rType = rPrefix + "type";
        var rValue = rPrefix + "value";
        var rew = config.crates[currentCrate].items[itemID].huskydata.rewards[num];
        if(rew.type == "command"){
            if(!rew.hasOwnProperty("command")){
                config.crates[currentCrate].items[itemID].huskydata.rewards[num].command="say Hello, world!";
            }
        }else{
            if(rew.hasOwnProperty("command")){
                delete config.crates[currentCrate].items[itemID].huskydata.rewards[num].command;
            }
        }
        $("#rewardEntries").append('<tr><td><a class="btn btn-danger btn-block" id="' + rDel + '"style="color:white">&times;</a></td><td><select id="' + rType + '" class="form-control"><option ' + ( (rew.type.toLowerCase() == "command")?"selected":"" ) + ' value="command">Command</option><option ' + ( (rew.type.toLowerCase() == "item")?"selected":"" ) + ' value="item">Return Display Item</option></select></td><td><input ' + ( (rew.type.toLowerCase() == "item")?"disabled":"" ) + ' id="' + rValue + '" type="text" placeholder="Value" value="' + ( (rew.type.toLowerCase() == "command")?rew.command:"" ) + '" class="form-control"></td></tr>');
        $("#" + rType).change(function(){
            var num = $(this)[0].id.split("-")[3];
            config.crates[currentCrate].items[itemID].huskydata.rewards[num].type = $(this).val();
            updateRewardEditor(latestItemID);
        })
        $("#" + rValue).change(function(){
            switch(config.crates[currentCrate].items[itemID].huskydata.rewards[num].type.toLowerCase()){
                case "command":
                    config.crates[currentCrate].items[itemID].huskydata.rewards[num].command = $(this).val();
                break;
                case "item":
                    alert("?!?")
                break;
            }
            
            updateRewardEditor(latestItemID);
        })
        $("#" + rDel).click(function() {
            config.crates[currentCrate].items[itemID].huskydata.rewards.splice(num,1);
            updateRewardEditor(latestItemID);
        })
    }
}
function launchMetaEditor(itemID){
    latestItemID = itemID;
    if(!config.crates[currentCrate].items[itemID].enchants){
        config.crates[currentCrate].items[itemID].enchants = {};
    }
    $("#newEnchant").off("click").click(function() {
        var enchantName = prompt("Type a valid enchant name to create a new enchantment.");
        if(enchantName){
            config.crates[currentCrate].items[itemID].enchants[enchantName] = 1;
            updateMetaEditor(latestItemID);
        }
    })
    updateMetaEditor(latestItemID);
    $("#editItemMeta").modal("show").off("hidden.bs.modal").on("hidden.bs.modal", function() {
        saveMetaEditor(itemID);
    });
    var completeLore = "";
    for(var i = 0; i < config.crates[currentCrate].items[itemID].lore.length; i++){
        completeLore += config.crates[currentCrate].items[itemID].lore[i] += "\n";
    }
    completeLore = completeLore.substring(0,completeLore.length-1);
    $("#itemLore").val(completeLore);
    if(config.crates[currentCrate].items[itemID].nbt){
        editor.getSession().setValue(JSON.stringify(config.crates[currentCrate].items[itemID].nbt,null,"    "))
    }else{
        editor.getSession().setValue("")
    }
}
function updateMetaEditor(itemID){
    latestItemID = itemID;
    $("#enchantmentEntries").html("");
    for(enchantName in config.crates[currentCrate].items[itemID].enchants){
        var ePrefix = "item-" + itemID + "-enchant-" + enchantName + "-";
        var eDel = ePrefix + "delete";
        var eName = ePrefix + "type";
        var eLevel = ePrefix + "value";
        var enchantLevel = config.crates[currentCrate].items[itemID].enchants[enchantName];
        $("#enchantmentEntries").append('<tr><td><a class="btn btn-danger btn-block" id="' + eDel + '" style="color:white">&times;</a></td><td><input id="' + eName + '" type="text" value="' + enchantName + '" placeholder="Name" class="form-control"></td><td><input id="' + eLevel + '" type="number" placeholder="Level" value="' + enchantLevel + '" class="form-control"></td></tr>');
        $("#" + eName).change(function(){
            var oldName = $(this)[0].id.split("-")[3];
            var oldData = JSON.parse(JSON.stringify(config.crates[currentCrate].items[itemID].enchants[oldName]))
            delete config.crates[currentCrate].items[itemID].enchants[oldName];
            config.crates[currentCrate].items[itemID].enchants[$(this).val()] = oldData
            updateMetaEditor(latestItemID);
        })
        $("#" + eLevel).change(function(){ 
            var id = $(this)[0].id.split("-")[3];
            config.crates[currentCrate].items[itemID].enchants[id] = $(this).val();
            updateMetaEditor(latestItemID);
        })
        $("#" + eDel).click(function() {
            var id = $(this)[0].id.split("-")[3];
            delete config.crates[currentCrate].items[itemID].enchants[id];
            updateMetaEditor(latestItemID);
        })
    }
}
function saveMetaEditor(itemID){
    var lore = $("#itemLore").val().split("\n");
    config.crates[currentCrate].items[itemID].lore = lore;
    if(editor.getSession().getValue().length > 0){
        try{
            config.crates[currentCrate].items[itemID].nbt = JSON.parse(editor.getSession().getValue());
        }catch(e){
            alert(e+"\n\nPlease resolve this error before saving.");
            $("#editItemMeta").modal("show");
            return;
        }
    }
}
function createNewCrate() {
    var name = $("#newCrateName").val();
    var id = $("#newCrateID").val();
    var type = $("#newCrateType").val();
    var err = false;
    if(name.length == 0){
        err = true;
        $("#newCrateName").addClass("is-invalid");
        $("#newCrateNameInvalid").text("You must enter a name.")
        $("#newCrateNameInvalid").show();
    }else{
        $("#newCrateName").removeClass("is-invalid");
        $("#newCrateNameInvalid").hide();
    }
    if(id.length == 0 || config.crates.hasOwnProperty(id)){
        err = true;
        $("#newCrateID").addClass("is-invalid");
        if(config.crates.hasOwnProperty(id) && id.length > 0){
            $("#newCrateIDInvalid").text("A crate with that ID already exists!")
        }else{
            $("#newCrateIDInvalid").text("You must enter a Crate ID.")
        }
        $("#newCrateIDInvalid").show();
    }else{
        $("#newCrateID").removeClass("is-invalid");
        $("#newCrateIDInvalid").hide();
    }
    if(type == null){
        err = true;
        $("#newCrateType").addClass("is-invalid");
        $("#newCrateTypeInvalid").text("You must select a Crate Type.")
        $("#newCrateTypeInvalid").show();
    }else{
        $("#newCrateType").removeClass("is-invalid");
        $("#newCrateTypeInvalid").hide();
    }

    if(!err){
        config.crates[id] = {
            name:name,
            options:{},
            spinnerOptions:{},
            type:type,
            items:[]
        }
        triggerCrate(id);
        $("#newCrateModal").modal('hide');
    }
}
var processingInstances=[];
function updateUI() {
    if(config && currentCrate == null){
        if(config.crates){
            for(crate in config.crates){
                triggerCrate(crate);
                return;
            }
        }
    }
    if(config.crates[currentCrate].type.toLowerCase() != "spinner"){
        $("#crateSpinnerOptions-button").addClass("disabled");
        if(currentPage == "crateSpinnerOptions"){
            triggerPage("crateOverview");
            return;
        }
    }else{
        $("#crateSpinnerOptions-button").removeClass("disabled");
    }
    $("#crates").show();
    $("#crates").html("");
    
    for(crate in config.crates){
        //$("#crates").append('<li class="nav-item"> <a class="nav-link ' + ((crate == currentCrate)?'active':'') + '" id="' + crate + '-button" href="javascript:triggerCrate(\'' + crate + '\')">' + colorCodeStrip(config.crates[crate].name) + '</a></li>')
        $("#crates").append('<option ' + ((currentCrate == crate)?"selected":"") + ' value="' + crate + '">' + colorCodeStrip(config.crates[crate].name) + " (" + crate + ")</option>")
    }
    hidePages();
    if(!currentCrate) return;
    var crate = config.crates[currentCrate];
    switch(currentPage){
        case "crateOverview":
            $("#displayname").val(crate.name).off("change").change(function(){
                config.crates[currentCrate].name = $(this).val();
                updateUI();
            });
            $("#crateID").val(currentCrate).off("change").change(function() {
                var old = JSON.parse(JSON.stringify(config.crates[currentCrate]));
                delete config.crates[currentCrate];
                currentCrate = $(this).val();
                config.crates[currentCrate] = old;
                updateUI();
            })
            $("#cratetype").val(crate.type.toLowerCase()).off("change").change(function() {
                config.crates[currentCrate].type = $(this).val();
                updateUI();
            })
            $("#itemCount").text(crate.items.length);
            var weightSum = 0;
            for(var i = 0; i < crate.items.length; i++){
                var item = crate.items[i];
                weightSum += item.huskydata.weight;
            }
            $("#itemWeightSum").text(weightSum);
            $("#avgChance").text(100*((weightSum/crate.items.length)/weightSum) + "%").attr("title","Actual Weight: " + (weightSum/crate.items.length));
        break;
        case "crateItems":
            $("#items").html("");
            $("#newItem").off("click").click(function() {
                config.crates[currentCrate].items.push({
                    id:"minecraft:dirt",
                    name:"New Item",
                    count:1,
                    huskydata:{
                        rewards:[
                            {type:"item"}
                        ],
                        weight:1
                    }
                })
                updateUI();
            })
            var weightSum = 0;
            for(var i = 0; i < crate.items.length; i++){
                var item = crate.items[i];
                weightSum += item.huskydata.weight;
            }
            for(id in crate.items){
                var prefix = "item-" + id + "-";
                var del = prefix + "delete";
                var name = prefix + "name";
                var itemID = prefix + "itemID";
                var damage = prefix + "damage";
                var count = prefix + "count";
                var meta = prefix + "meta";
                var weight = prefix + "weight";
                var rewards = prefix + "rewards";
                var item = crate.items[id];
                $("#items").append('<tr id="item-' + id + '"><td><a id="'+ del +'" class="btn btn-danger btn-block" style="color:white">&times;</a></td><td><input type="text" placeholder="Name" value="' + item.name + '" class="form-control" id="'+ name +'"></td><td><input type="text" placeholder="Item ID" value="' + item.id + '" class="form-control" id="'+ itemID +'"></td><td><input type="number" placeholder="Damage" value="' + ((item.damage)?item.damage:"0") + '" class="form-control" id="'+ damage +'"></td><td><input type="number" placeholder="Count" value="' + ((item.count)?item.count:"1") + '" class="form-control" id="'+ count +'"></td><td><a class="btn btn-secondary btn-block" href="javascript:launchMetaEditor(' + id + ')" style="color:white" id="'+ meta +'">Edit</a></td><td><div class="input-group"><input type="number" value="' + item.huskydata.weight + '" placeholder="Weight" class="form-control" id="'+ weight +'"><span class="input-group-append"><span class="input-group-text">/ ' + weightSum +'</span></span></div></td><td><a href="javascript:launchRewardEditor(' + id + ')" class="nav-item nav-link btn btn-primary" style="color:white" id="'+ rewards +'">Edit (' + item.huskydata.rewards.length + ')</a></td></tr>')
                $("#" + del).off("click").click(function(){
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items.splice(id,1);
                    updateUI();
                })
                $("#" + name).off("change").change(function() {
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items[id].name = $(this).val();
                    updateUI();
                })
                $("#" + damage).off("change").change(function() {
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items[id].damage = parseFloat($(this).val());
                    updateUI();
                })
                $("#" + count).off("change").change(function() {
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items[id].count = parseFloat($(this).val());
                    updateUI();
                })
                $("#" + meta).off("click").click(function(){
                    var id = parseFloat(this.id.split("-")[1]);
                    //config.crates[currentCrate].items.splice(id,1);
                    updateUI();
                })
                $("#" + weight).off("change").change(function() {
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items[id].huskydata.weight = parseFloat($(this).val());
                    updateUI();
                })
                $("#" + rewards).off("click").click(function(){
                    var id = parseFloat(this.id.split("-")[1]);
                    //config.crates[currentCrate].items.splice(id,1);
                    updateUI();
                })
            }
        break;
        case "crateOptions":
            if(!config.crates[currentCrate].options){
                config.crates[currentCrate].options = {}
            }
            if(!config.crates[currentCrate].options.particle1){
                config.crates[currentCrate].options.particle1 = {};
            }
            if(!config.crates[currentCrate].options.particle2){
                config.crates[currentCrate].options.particle2 = {};
            }
            if(!config.crates[currentCrate].options.particle1.color){
                config.crates[currentCrate].options.particle1.color=[100,100,100];
            }
            if(!config.crates[currentCrate].options.particle2.color){
                config.crates[currentCrate].options.particle2.color=[255,0,0];
            }
            $("#part-1-color").css("background-color","#" + rgbToHex(
                crate.options.particle1.color[0],
                crate.options.particle1.color[1],
                crate.options.particle1.color[2]
            ))
            $("#part-1-r").val(crate.options.particle1.color[0]).off("change").change(function() {
                config.crates[currentCrate].options.particle1.color[0] = $(this).val();
                updateUI();
            })
            $("#part-1-g").val(crate.options.particle1.color[1]).off("change").change(function() {
                config.crates[currentCrate].options.particle1.color[1] = $(this).val();
                updateUI();
            })
            $("#part-1-b").val(crate.options.particle1.color[2]).off("change").change(function() {
                config.crates[currentCrate].options.particle1.color[2] = $(this).val();
                updateUI();
            })
            $("#part-2-color").css("background-color","#" + rgbToHex(
                crate.options.particle2.color[0],
                crate.options.particle2.color[1],
                crate.options.particle2.color[2]
            ))
            $("#part-2-r").val(crate.options.particle2.color[0]).off("change").change(function() {
                config.crates[currentCrate].options.particle2.color[0] = $(this).val();
                updateUI();
            })
            $("#part-2-g").val(crate.options.particle2.color[1]).off("change").change(function() {
                config.crates[currentCrate].options.particle2.color[1] = $(this).val();
                updateUI();
            })
            $("#part-2-b").val(crate.options.particle2.color[2]).off("change").change(function() {
                config.crates[currentCrate].options.particle2.color[2] = $(this).val();
                updateUI();
            })
            if(!procInstance){
                procInstance = new Processing(document.getElementById("preview"),cratePreview)
            }
            if(!crate.options.hasOwnProperty("freeCrate")){
                config.crates[currentCrate].options.freeCrate = false;
            }
            if(crate.options.freeCrate == true){
                $("#freeCrateToggle").addClass("btn-success").removeClass("btn-secondary").text("Enabled").off("click").click(function() {
                    delete config.crates[currentCrate].options.freeCrateDelay;
                    config.crates[currentCrate].options.freeCrate = false;
                    updateUI();
                });
            }else{
                $("#freeCrateToggle").addClass("btn-secondary").removeClass("btn-success").text("Disabled").off("click").click(function() {
                    config.crates[currentCrate].options.freeCrate = true;
                    config.crates[currentCrate].options.freeCrateDelay = 0;
                    updateUI();
                });
            }
            $("#freeCooldown").val(config.crates[currentCrate].options.freeCrateDelay).off("change").change(function() {
                config.crates[currentCrate].options.freeCrateDelay = $(this).val();
                updateUI();
            })
        break;
    }
    $("#" + currentPage).show();
}
var lastInterval = -1;
function cratePreview(processing) {
    processing.size(400,200);
    processing.draw = function() {
        var ccOp = config.crates[currentCrate].options;
        var width = processing.width;
        var height = processing.height;
        processing.stroke(0,0,0,100);
        processing.strokeWeight(1);
        processing.background(0,0,0,0);
        processing.fill(0);
        processing.textAlign(processing.LEFT,processing.TOP);
        //processing.text(processing.frameCount,10,10)
        
        processing.pushMatrix();

            processing.translate(width/2,height/2);
                    processing.scale(1.5);
            /*processing.stroke(255,0,0);
            processing.strokeWeight(3);
            processing.point(0,0);*/
            processing.translate(0,-30)

            processing.fill(152,100,33)
            processing.stroke(51,45,36);
            processing.strokeWeight(3)
            processing.quad(-40,0,0,-20,39,0,0,20);
            processing.quad(-40,0,0,20,0,70,-40,50);
            processing.quad(40,0,0,20,0,70,40,50)
            processing.line(40,20,0,40);
            processing.line(-40,20,0,40)
            processing.fill(185,185,185);
            processing.stroke(100);
            processing.strokeWeight(1);
            processing.quad(
                25,17,
                18,20,
                18,40,
                25,37)
            processing.fill(ccOp.particle1.color[0],ccOp.particle1.color[1],ccOp.particle1.color[2],210)
            processing.noStroke();
            for(var i = -3; i <= 3; i++){
                var siz = 15-(((processing.frameCount/5)+i)%15);
                processing.ellipse(i*17,33 + (Math.sin((i-3)/2)*10),siz,siz)
            }
            processing.fill(ccOp.particle2.color[0],ccOp.particle2.color[1],ccOp.particle2.color[2],210)
            for(var i = -3; i <= 3; i++){
                var siz = 15+((((-(processing.frameCount+20))/5)+i)%15);
                processing.ellipse(i*17,43 + (Math.sin((i+3)/2)*10),siz,siz)
            }
        processing.popMatrix();


        //processing.rect(width/2,height/2,30,30)
    }
}
var procInstance;
var hexPart = function (rgb) { 
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};
var rgbToHex = function(r,g,b) {   
  var red = hexPart(r);
  var green = hexPart(g);
  var blue = hexPart(b);
  return red+green+blue;
};
function colorCodeStrip(txt){
    return txt.replace(/&[0-9A-FK-OR]/ig,"");
}
function hidePages() {
    for(page in pages){
        $("#" + pages[page]).hide();
    }
}
function deactivateCrates(){
    for(crate in config.crates){
        $("#" + crate + "-button").removeClass("active");
    }
}
function deactivateSidebar() {
    for(page in pages){
        $("#" + pages[page] + "-button").removeClass("active");
    }
}
function triggerPage(page){
    if(!currentCrate){
        currentPage = "crateOverview";
        return;
    }
    deactivateSidebar();
    $("#" + page + "-button").addClass("active");
    currentPage = page;
    updateUI();
}
function triggerCrate(crate){
    $("#" + crate + "-button").addClass("active");
    currentCrate = crate;
    updateUI();
}