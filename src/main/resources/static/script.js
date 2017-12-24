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
var currentPage = "default";
var pages = ["default","crateOverview","crateItems","crateOptions","crateSpinnerOptions"];
function updateUI() {
    $("#crates").html("");
    for(crate in config.crates){
        $("#crates").append('<li class="nav-item"> <a class="nav-link" id="' + crate + '-button" href="javascript:triggerCrate(\'' + crate + '\')">' + colorCodeStrip(config.crates[crate].name) + '</a></li>')
    }
    if(currentCrate){
        hidePages();
        var crate = config.crates[currentCrate];
        switch(currentPage){
            case "crateOverview":
                $("#displayname").val(crate.name).change(function(){
                    config.crates[currentCrate].name = $(this).val();
                    updateUI();
                })
            break;

        }
        $("#" + currentPage).show();
    }else{

    }
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
        currentPage = "default";
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
    triggerPage("crateOverview");
}