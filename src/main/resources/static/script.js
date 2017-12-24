const socket = io("http://localhost:46544");
var config = {"crates":{"sosbasic":{"type":"Roulette","items":[{"lore":["Speakerbox"],"name":"BLAM","huskydata":{"overrideRewardName":"BLAM","rewards":[{"type":"item"}],"weight":1},"damage":3,"formatversion":1,"count":2,"id":"minecraft:planks"},{"formatversion":1,"huskydata":{"weight":3,"rewards":[{"type":"command","command":"smite %p"}]},"count":2,"id":"minecraft:ender_pearl","name":"&bLightning Pearl","lore":["&7Legend has it, just looking at this","&7pearl causes localized lightning."]}],"spinnerOptions":{"maxClicks":50,"dampening":1.025},"options":{"particle1":{"color":[150,150,0]},"crateBlockID":"minecraft:sponge","particle2":{"color":[100,100,0]},"keyID":"minecraft:iron_nugget"},"name":"&eSoS &6XIV &7Basic"},"command":{"type":"Spinner","items":[{"name":"Diamond Box","id":"minecraft:diamond","formatversion":1,"huskydata":{"rewards":[{"type":"command","command":"give %p minecraft:diamond 10"}],"weight":1},"count":1,"type":"Spinner","lore":["10 Minecraft Diamond"]},{"lore":["Speakerbox"],"name":"BLAM","formatversion":1,"id":"minecraft:dirt","count":2,"huskydata":{"overrideRewardName":"BLAM","weight":1,"rewards":[{"type":"command","command":"say %p is a potato."}]}},{"huskydata":{"weight":1,"overrideRewardName":"be a sore loser","rewards":[{"type":"command","command":"crate key command %p"}]},"formatversion":1,"name":"&4be a sore loser","id":"minecraft:stone","count":3,"lore":["try again BOI"]},{"formatversion":1,"id":"minecraft:dirt","name":"trash","huskydata":{"overrideRewardName":"trash","weight":1,"rewards":[{"type":"command","command":"say meh"}]},"count":4,"lore":["10 Minecraft Diamond"]}],"spinnerOptions":{"maxClickModifier":3,"minClickModifier":-3,"maxClicks":100,"dampening":1.025},"name":"&3Command Crate","options":{"keyID":"minecraft:dirt","particle2":{"color":[255,0,255]},"particle1":{"color":[0,255,0]}}},"soscool":{"name":"&eSoS &6XIV &aCool","items":[{"id":"minecraft:stick","name":"&4Bitchin Stick","formatversion":1,"count":1,"huskydata":{"rewards":[{"type":"item"}],"weight":1},"enchants":{"knockback":255,"satan":55}}],"options":{"keyID":"minecraft:gold_nugget","particle1":{"color":[255,255,0]},"crateBlockID":"minecraft:sponge","particle2":{"color":[150,150,0]}},"type":"Spinner","spinnerOptions":{"maxClicks":50,"dampening":1.025}},"sosbattle":{"type":"instant","items":[{"lore":["&bbrr brr brr brr"],"id":"minecraft:stick","formatversion":1,"name":"&3Chill Stick","count":1,"huskydata":{"rewards":[{"type":"item"}],"weight":1}}],"options":{"freeCrate":true,"particle2":{"color":[190,190,0]},"particle1":{"color":[255,72,0]},"crateBlockID":"minecraft:ender_chest","freeCrateDelay":5},"spinnerOptions":{"maxClicks":50,"dampening":1.025},"name":"&aSoS &6XIV &l&cArena","lang":{"rewardMessage":"Have %a &a%R&r!","prefix":"&c&lARENA&r&e>> "}},"fancy":{"name":"&bFancy Cool Crate","type":"Spinner","options":{"particle2":{"color":[255,255,0]},"particle1":{"color":[0,255,0]}},"items":[{"name":"minecraft:diamond","id":"minecraft:diamond","formatversion":1,"count":1,"huskydata":{"rewards":[{"type":"item"}],"weight":5}},{"name":"minecraft:dirt","formatversion":1,"id":"minecraft:dirt","count":15,"huskydata":{"rewards":[{"type":"item"}],"weight":20}},{"formatversion":1,"name":"&3Stoned the Stones","id":"minecraft:cobblestone","lore":["He once was a spooky stones."],"count":1,"huskydata":{"rewards":[{"type":"item"}],"weight":1}},{"formatversion":1,"count":1,"lore":[":)"],"name":"&6Pre-cut wood","huskydata":{"rewards":[{"type":"item"}],"weight":1},"id":"minecraft:planks"},{"formatversion":1,"lore":["idk someone gave it to me"],"id":"minecraft:diamond_sword","count":1,"name":"&cFancy sword","huskydata":{"rewards":[{"type":"item"}],"weight":1}}]}}};
updateUI();
socket.on("connect", function() {
    console.log("connection to huskyconfigurator");
})
socket.on("configData",function(data){
    config = JSON.parse(data);
    console.log("JSON config received!")
    updateUI();
})
var currentCrate = null;
var currentPage = "crateOverview";
var pages = ["crateOverview","crateItems","crateOptions","crateSpinnerOptions","crateLang","globalLang"];
$("#crates").change(function() {
    triggerCrate($(this).val());
})
if(config != null){
    updateUI();
}
$("#newCrate").click(function() {
    $("#newCrateModal").modal('show')
})
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
            $("#displayname").val(crate.name).change(function(){
                config.crates[currentCrate].name = $(this).val();
                updateUI();
            });
            $("#crateID").val(currentCrate).change(function() {
                var old = JSON.parse(JSON.stringify(config.crates[currentCrate]));
                delete config.crates[currentCrate];
                currentCrate = $(this).val();
                config.crates[currentCrate] = old;
                updateUI();
            })
            $("#cratetype").val(crate.type.toLowerCase()).change(function() {
                config.crates[currentCrate].type = $(this).val();
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
            $("#newItem").unbind()
            $("#newItem").click(function() {
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
                $("#items").append('<tr id="item-' + id + '"><td><a id="'+ del +'" class="btn btn-danger" style="color:white">&times;</a></td><td><input type="text" placeholder="Name" value="' + item.name + '" class="form-control" id="'+ name +'"></td><td><input type="text" placeholder="Item ID" value="' + item.id + '" class="form-control" id="'+ itemID +'"></td><td><input type="text" placeholder="Damage" value="' + ((item.damage)?item.damage:"0") + '" class="form-control" id="'+ damage +'"></td><td><input type="text" placeholder="Count" value="' + ((item.count)?item.count:"1") + '" class="form-control" id="'+ count +'"></td><td><a class="btn btn-secondary" style="color:white" id="'+ meta +'">Edit</a></td><td><div class="input-group"><input type="text" value="' + item.huskydata.weight + '" placeholder="Weight" class="form-control" id="'+ weight +'"><span class="input-group-addon">/ ' + weightSum +'</span></div></td><td><a class="nav-item nav-link btn btn-primary" style="color:white" id="'+ rewards +'">Edit (' + item.huskydata.rewards.length + ')</a></td></tr>')
                $("#" + del).click(function(){
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items.splice(id,1);
                    updateUI();
                })
                $("#" + name).change(function() {
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items[id].name = $(this).val();
                    updateUI();
                })
                $("#" + damage).change(function() {
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items[id].damage = parseFloat($(this).val());
                    updateUI();
                })
                $("#" + count).change(function() {
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items[id].count = parseFloat($(this).val());
                    updateUI();
                })
                $("#" + meta).click(function(){
                    var id = parseFloat(this.id.split("-")[1]);
                    //config.crates[currentCrate].items.splice(id,1);
                    updateUI();
                })
                $("#" + weight).change(function() {
                    var id = parseFloat(this.id.split("-")[1]);
                    config.crates[currentCrate].items[id].huskydata.weight = parseFloat($(this).val());
                    updateUI();
                })
                $("#" + rewards).click(function(){
                    var id = parseFloat(this.id.split("-")[1]);
                    //config.crates[currentCrate].items.splice(id,1);
                    updateUI();
                })
            }
        break;

    }
    $("#" + currentPage).show();
}
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