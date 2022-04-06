
window.onload = init;

function init() {
    // Initialize three.js
    console.log("hello")
    var width;      
    var closeSelect = false;
    const navBar = document.getElementById('side-bar');
    const closeButton = document.getElementById('close-button');
    const dash = document.getElementById("dash");
    const control = document.getElementById("control");
    const auto = document.getElementById("auto");
    const files = document.getElementById("files");
    const help = document.getElementById("help");
    const licensing = document.getElementById("licensing");
    const header = document.getElementById("header");
    const footer = document.getElementById("footer");
    const navButtons = document.getElementsByClassName("nav-button");

    let url = new URL(window.location.href);
    switch (url.pathname) { // Maybe add regex in order to allow anything past e.g. /home/stuff still works
        case "/home":
            focusButton(dash);
            break;
        case "/control":
            focusButton(control);
            break;
        case "/auto":
            focusButton(auto);
            break;
        case "/files":
            focusButton(files);
            break;
        case "/help":
            focusButton(help);
            break;
        case "/licensing":
            focusButton(licensing);
            break;
    }

        
    updateSideBar();
    if (navBar.className == "closed-nav") {
        navBar.style.overflow = 'hidden';
    }
    function updateSideBar() {
        width = window.innerWidth;
        if (width < 900) {
            navBar.className = "closed-nav";
        }

        if (width > 900  && !closeSelect) {
            navBar.className = "side-nav";
        }
    }

    function openNav() {
        navBar.className = "side-nav";
        
    }

    function closeNav() {
        navBar.className = "closed-nav";
        
    }

    function toggle(value) {
        if (value) {
            return false;
        } else {
            return true;
        }
    }

    window.addEventListener('resize', updateSideBar);
    
    navBar.onmouseover = function () {if (!closeSelect) {navBar.className = 'side-nav'; navBar.style.overflow = 'auto';}}
    navBar.onmouseout = function () { if (width < 900 || closeSelect) navBar.className = 'closed-nav'; navBar.style.overflow = 'hidden';}

    closeButton.onclick = function(e) {
                            
                            closeSelect = toggle(closeSelect);

                            if (closeSelect) {
                                closeButton.innerHTML = "&#10132";
                                console.log("nav closing..");
                                closeNav();}; 
                                
                            

                            if (!closeSelect) {
                                closeButton.innerHTML = "&#10006";
                                console.log('nav opening')
                                openNav();}
                           
    }

   document.getElementById("inverseKin").onclick = function(e) {
        Arm.inverseKinematics(Arm.coords.x, Arm.coords.y, Arm.coords.z, 0 , 0, 0);
    } 

    

    // Screen Change Function

    // 0 = Home
    // 1 = Control
    // 2 = Auto
    // 3 = Files
    // 4 = Help
    // 5 = Licensing 
    // 6 = Settings

    function focusButton(button) {
        button.style.backgroundColor = "#1d1d1d";
        button.style.borderTop = "2px solid currentColor";
        button.style.borderBottom = "2px solid currentColor"
        button.style.boxShadow = "0px 0px 15px -3px black"
        button.style.padding = "16px 25px";
    }

    function unfocusButton(button) {
        button.style.backgroundColor = null;
        button.style.transform = null;
        button.style.borderTop = null;
        button.style.borderBottom = null;
        button.style.boxShadow = null;
    }

    function unfocusButtons(buttons) {
        for (var i = 0; i < buttons.length; i++) {
            unfocusButton(buttons[i]);
        }
    }

    
}



