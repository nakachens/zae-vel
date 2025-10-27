/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

// asset path helper function
const getAssetPath = (path) => {
  if (window.require) {
    try {
      const { remote, ipcRenderer } = window.require('electron');
      const isDev = process.env.NODE_ENV === 'development';
      
      if (isDev) {
        return path; 
      } else {
        const pathModule = window.require('path');
        const appPath = remote ? remote.app.getAppPath() : process.resourcesPath;
        return pathModule.join(appPath, path.replace('./', ''));
      }
    } catch (error) {
      console.log('Electron modules not available, using web paths');
    }
  }

  return path;
};

// txt feelings here
const fileContents = {
  "zozo-message.txt": `h-hi

hi hi yes yes this is your developer fren who made this desktop os system, yeah.. designed and developed by me and me alone for my best friend, you. i worked hard on this for like a month and man(2 months actually).. my back hurts genuinely i feel like i felt a crack too..

anyways ive been sleep deprived cuz of this thing, i hope u like it, i hate the wallpaper, cant decide on one but oh well and yeah i hope whoever else tries it out also likes it, i tried my best to maintain perfect functionality, made everything from scratch, used google and ai shit to figure out the logics and yeah (which doesnt wokr) + several allnighters and here we are
oh you wouldnt want a developer friend man im so tired or id explain each and everything in this code.. but this is fine.. yeah.. this.. is.... f-fine..

- zoha 
(also goes by zoe, zoza, zozo, zochan, nakachan, hakuchin's mother(the pet dude))`,

  "about-me.txt": `plan of making this project (ᵕ—ᴗ—)

this project was planned in early august and the work on it began in early september..(づ ◕‿◕ )づ♡
finished the prototype in 2 weeks and submitted to a coding challenge and lost miserably, but idc it was going to be made for my best fren anyway
so heres the v 3.something with ALL NEW FEATURES~
now heres my favourite thingies cuz im bored
I love uh:
- PLAYING GAMES
- SLEEPING
- SLEEPING 2X
- BUILDING
- WORKING MYSELF TO THE BONE
yeah ok yup yup 
Hope u enjoyed exploring yara! (っ╥﹏╥)っ`,

  "what-i-learnt.txt": `What I Learned Building This Desktop (ᵕ—ᴗ—)!

Technical Skills (idk if anyone gonna read it but im gonna just dump my progress here):
- React component architecture (it was a good refresh!!)
- CSS styling and animations (oh this was HELL)
- Audio integration for UI sounds (not much of a challenge!)
- Responsive design principles (oh HELL)
- File system simulation (OH HELLLL EVEN THO I TOOK LOTS OF HELP FROM AI)

Design Insights:
- Color harmony in autumn palettes (this was super fun)
- Retro UI design patterns (SO FUN)
- User experience flow (VERY MUCH FUN and torturing)
- Interactive feedback importance (very much torturing AND FUN)
- Accessibility considerations (SO FUN)

Personal Growth:
- Patience with pixel-perfect details (pain.)
- Joy in small interactions (VERY FUN)
- Value of consistent theming (FUN)
- Pride in craftsmanship (VERY MUCH)
 ( ◡̀_◡́)ᕤ`,

  "pain.txt": ` things 2 cut off for my diet

- chocolates
- dark chocolates
- white chocolates
- pancakes
- anything with sugar
- rice 

 oh i aint gona survive..`,

  "pancake-recipe.txt": `protein pancakes recipe

Ingredients:
- flour
- vanilla essence thingy
- baking powder
- salt
- eggs
- milk
- very little butter
- protein powder

Instructions:
1. mix all dry ingredients in bowl
2. then add all wet ingredients
3. mix until smooth-ish
4. grease ur pan so it doesnt stick
5. pour VERY carefully in the pan n flip after EXACT 2 mins 
6. AND UR DONEEE

noted. saving for future use !

(im craving some with coffee now..)♡•`,

  "hidden-secrets.txt": `more cool stuff hehe

OKAY SO did you find all of these yet? (ᵕ—ᴗ—)✨

🦹 Hidden Features:
- Right-click taskbar items for context menus
- Hover animations on desktop widgets  
- Sound effects on most interactions
- Different app window scaling behaviors
- Retro scanline effects in some apps

🦹 Design Details:
- Every border uses the autumn color scheme
- Consistent 3D button styling throughout (i cried at this)
- Paper texture backgrounds in text apps
- cool emoji usage everywhere (huhu)

🦹 Audio Elements:
- Click sounds for buttons
- Card flip sounds in poetry app  
- realistic styled music player
- Keyboard typing sounds in some apps (ITS SO SATISFYING)

theres more btw lets see what you find :P`,
};

// folder 
function FolderApp({ folderType = "files", onOpenFile }) {
  const [selectedItem, setSelectedItem] = useState(null);
  
  const playClickSound = () => {
    const audio = new Audio(getAssetPath('/click.mp3'));
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const fileItems = [
    { name: "zozo-message.txt", icon: getAssetPath("./assets/txt.png"), type: "txt" },
    { name: "about-me.txt", icon: getAssetPath("./assets/txt.png"), type: "txt" },
    { name: "what-i-learnt.txt", icon: getAssetPath("./assets/txt.png"), type: "txt" },
    { name: "pain.txt", icon: getAssetPath("./assets/txt.png"), type: "txt" },
    { name: "pancake-recipe.txt", icon: getAssetPath("./assets/txt.png"), type: "txt" },
    { name: "hidden-secrets.txt", icon: getAssetPath("./assets/txt.png"), type: "txt" }
  ];

  // images files
  const imageItems = [
    { name: "e-e-eye contactooo???", icon: getAssetPath("./images/1.jpeg"), type: "image" },
    { name: "never-ask-a-man-his-past", icon: getAssetPath("./images/2.jpeg"), type: "image" },
    { name: "skincare-videocall-sesh", icon: getAssetPath("./images/3.jpeg"), type: "image" },
    { name: "haha-this-is-nothing", icon: getAssetPath("./images/4.jpeg"), type: "image" },
    { name: "she-hates-me-#hater", icon: getAssetPath("./images/5.jpeg"), type: "image" },
    { name: "she-hates-me-2", icon: getAssetPath("./images/finger.jpeg"), type: "image" },
    { name: "oh-shes-everywhere", icon: getAssetPath("./images/7.jpeg"), type: "image" },
    { name: "what", icon: getAssetPath("./images/7.jpeg"), type: "image" },
    { name: "the-real-ones-get-it", icon: getAssetPath("./images/8.jpeg"), type: "image" },
    { name: "the-1st-zhongli-main-to-ever-exist", icon: getAssetPath("./images/9.jpeg"), type: "image" },
    { name: "10th-grade-GAHHHH", icon: getAssetPath("./images/10.jpeg"), type: "image" },
    { name: "vc...", icon: getAssetPath("./images/11.jpeg"), type: "image" },
    { name: "omg-first-irl-meetup", icon: getAssetPath("./images/12.png"), type: "image" },
    { name: "feet", icon: getAssetPath("./images/13.jpeg"), type: "image" },
    { name: "best-name-era", icon: getAssetPath("./images/14.jpeg"), type: "image" },
    { name: "MINI-ZAI", icon: getAssetPath("./images/minizai.jpeg"), type: "image" },
    { name: "8-years-ago", icon: getAssetPath("./images/rando.jpeg"), type: "image" },
    { name: "CUTE-CUTE-CUTE-CUTE", icon: getAssetPath("./images/minizai2.jpeg"), type: "image" },
    { name: "the history-goes-long", icon: getAssetPath("./images/oldisgold.jpeg"), type: "image" },
    { name: "our-cool-meetup", icon: getAssetPath("./images/img-20.jpeg"), type: "image" },
    { name: "SHES-SO-FUCKING-ADORABLE", icon: getAssetPath("./images/CUTEST.jpeg"), type: "image" }
  ];

  const items = folderType === "files" ? fileItems : 
                folderType === "images" ? imageItems : 
                yaraItems;

  const handleDoubleClick = (item, index) => {
    playClickSound();
    if (onOpenFile) {
      onOpenFile(item, fileContents[item.name] || "");
    }
  };

  return (
  <div className="w-full h-full flex flex-col" 
       style={{ 
         background: 'linear-gradient(145deg, #3E2B27, #1E1A19)',
         fontFamily: 'Courier New, monospace'
       }}>
    
    {/* folder header*/}
    <div className="flex items-center justify-between p-4 border-b border-stone-600">
      <div className="flex items-center space-x-2">
        <span className="text-lg">📁</span>
        <h2 className="text-sm font-bold text-stone-300">
          {folderType === "files" ? "Text Files" : 
           folderType === "images" ? "Images" : 
           "Letters for Zaza ♡"}
        </h2>
      </div>
      <span className="text-xs text-stone-400 font-bold">{items.length} items</span>
    </div>

    {/* files grid*/}
    <div className="flex-1 p-4 overflow-auto">
      <div className="grid gap-3" style={{ 
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gridAutoRows: 'minmax(100px, auto)'
      }}>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-3 rounded border cursor-pointer transition-all duration-200 hover:transform hover:scale-105"
            style={{
              background: 'linear-gradient(145deg, #5A4A45, #4A3F3A)',
              borderColor: selectedItem === index ? '#8B2A2A' : 'rgba(124, 139, 106, 0.3)',
              borderWidth: '1px',
              boxShadow: selectedItem === index ? '0 0 8px rgba(139, 42, 42, 0.5)' : 'none',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => {
              playClickSound();
              setSelectedItem(index);
            }}
            onDoubleClick={() => handleDoubleClick(item, index)}
          >
            <div className="flex items-center justify-center mb-2" style={{ height: '32px', width: '32px' }}>
              {typeof item.icon === 'string' && item.icon.startsWith('/') ? (
                <img 
                  src={item.icon} 
                  alt={item.name}
                  className="w-8 h-8 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <img 
                  src={item.icon} 
                  alt={item.name}
                  className="w-8 h-8 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
              )}
              <span className="text-2xl hidden">{item.type === 'txt' ? '📄' : '🖼️'}</span>
            </div>
            <span className="text-xs text-center text-stone-300 font-bold break-words leading-tight">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* status */}
    <div className="flex justify-between items-center bg-stone-800 border-t border-stone-600 px-4 py-2 text-xs text-stone-400">
      <span className="font-bold">{selectedItem !== null ? `Selected: ${items[selectedItem].name}` : 'No selection'}</span>
      <span className="font-bold">
        {folderType === "files" ? "Text Files" : 
         folderType === "images" ? "Images" : 
         "Letters for Zaza ♡"}
      </span>
    </div>
  </div>
);
}

// eslint-disable-next-line react-refresh/only-export-components
export { FolderApp, fileContents };