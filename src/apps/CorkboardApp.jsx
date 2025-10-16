/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

// letter contents
const letterContents = {
  1: `yara u started college last september and you just.. LIKE YOURE HITTING THAT POTENTIAL BRO . im seeing that progress, that motivation, that grind,
youre making amazing friends, youre living that life we always dreamt of, youre enjoying everything and experiencing so much and im so fucking proud of you bro
seeing you grow and meet new people and build this whole new life for yourself makes me so proud honestly. like thats MY best friend man (wait do i really know you... w-we are friends right..?)
ik i never say it enough but genuinely its just i dont know how. you deserve all the good things happening to you right now. and even if something goes wrong, dw zoza gotchu~
keep shining yara, kira kira kagayaki~ 
your biggest cheerleader,
me hehe hehe hehe -zoza`,
  2: `question: whats your genuine view of zai now, how is she different from "noah" we knew? do you think noah was different from zai? 
  
byo- noah was different. hella. i knew noah since she was 13, shes had bad days bad trauma that leave bitter aftertastes but noah was also super sweet and caring and willing to do anything for her friends. 
the difference between her then and zai now should be noah hasn’t had much experience but now zai knows how to handle things more thoughtfully `,
  3: `yara..
  ik sometimes i dont give you the attention you deserve, or the thing you were expecting from me which leads to misunderstandings and hurtful moments but as ive said this to u before, and ill say it again, no matter what, you are always my first priority
  you have always been the one for me at my lowest, you have always been there when i was about to off myself man, you have no idea how much that meant to me, thats why youve signed me up as your official gaurd dog yea no kidding.
  i want to be your safe space too like youre mine, ill wait for you if we fight, ill apologize and change myself until u forgive me, ill change myself for you, i just want you to be happy, i want to see you always at your best. i dont want anyone to hurt you..
  so what i was saying was uh i actually forgot but ily pls dont leave me (i swear i sound like a yearning boyfriend wtf)`,
  4: `question: 8. if there was something you feel like you HAVE to tell zaza no matter what, knowing her personality, her lifestyle, her company, her behaviour, her choices, whats there something you'd like to tell her at all cost? something you've been holding in your chest and really want to tell her, something that must has to reach her. something you MUST tell her that you feel like she needs to know this. (can be both negative, positive)
   
byo- always trust yourself more than you want others to trust you. i’m begging. if it feels wrong then it is wrong. don’t let others influence your morale. you is you. i learned it the hard way so trust me as long as you know yourself the rest should be easy to navigate `,
  5: `b- our old fights just shaped us into a better relationships and understanding of each other honestly and i’m basking in all that. we all changed, me changed way too drastically too. and zai has changed as a more calm and collected person, my perspective of her will always be that shes  a soft hearted and whimsical person, her vibes just says “shiny shiny”`,
  6: `b- when we fought over my anger issues and her separation anxiety. i didn’t understand her and she wants me to see us and how we stand as best friends. that fight changed me into who i am today. she knew how avoidant i was and she showed me how terrible ive been acting. made me realized where i’m wrong and we come through again together. 
and there was one time where a gc named mafia xxy had a fall out and she chose to stayed by my side hearing my part of the story. we were crying hell together `,
  7: `yara have you noticed we have gone thru so much together, middle school, then middle school awkward phase, highschool, then highschool awkward phase, then we both became nallay berozgar and did everything every usual nallay berozgars do, all those moments are so nostalgic yar, the gaming era with me you and byo, the training arc, the comeback arc so many arcs we've gone thru tgt. crazy isnt it. and now, we're adults, real big adults going through their busy lifestyles.. scary haha we grew up didnt we`,
  8: `question: 4. do you think we can go back to playing games together as we did during old times? or youre just happy with the memories we made back then, if yes, whats the beauty you see in it, if no, whats something really feels special thinking about those old nostalgic memories?

b- honestly, we always made plans but always failed somehow but i do feel like we actually should at least try to play tgt again just to hear each other laughters. and to me the memories are the best hence why i still keep all the videos and pictures we took on every games we play. its the reminder that our path were once crossed together. i missed it and still visit the memories from time to time. we so hella funny back then girl.`,
  9: `b- at this age, i want you to focus on your study first and focus on my making friends and memories. trust me it get even busier once you reach 21 and above and realize you didn’t have much time as you were before. fuck around and finds out but not too far off from your safety net okay!`,
  10: `question: 2. zai has told me sometimes that she often feels left out when you guys talk to each other , its understandable since we all are so busy with our lives and dont get enough time to reply to each other, which in turn leaves the other left on read or maybe forgotten, what would you want to say about this to her

b- i’m so so so sorry and its okay to feel this way because sometimes we didn’t check the groupchat too and suddenly when we do all the conversations has been from two or three weeks ago, imo you can chimes in anytime you want bubu we all will reply you all the same! no way leaving each other out!
`,
  11: `yara do you remember that era last year when we got super close out of nowhere? like we were close but we got CLOSE CLOSE !!! like changed so much during that timeframe, met SO MANY new types of people, learnt SO MANY new things, even learnt alot about our culture!!! we really hit our desi roots back then lol`,
  12: `b- i still think of her as one of my close stabil best friends to ever been in my life like if at any moment of time we all decided to just yap to each other again it will feels like come home after a long day. we’ve all been super busy with life that now we have our own path to pursue and that’s the beauty in growing up, because i know shes still there shes just busy on her main and side quests is all `,
  13: `question: 9. if there happens any more misunderstanding between us, between me, you or zai, who would you want to reach out first? would you leave us on our own or would you like to talk it out? what would you like to tell future zai, what to do when we are back in an awkward phase again? (though i wish it never happen)

b- i would reach out in the groupchat first if there are misunderstandings and see the reactions. if one of the two has more intense or more disinterest i would reach out them. this is how i operate and it was by no means biased but yes i want to tell zaza that its okay to suddenly reach out either the gc or us personally, it will never feels like “umh idk if this is okay” no, we are way past that phase especially with me i will never treat anyone as close as you with disrespect like that. i appreciate the friendship more than you guys can imagine, you and zoi was there when nobody NOBODY even there`,
  14: `question: if any of us were to make a mistake, how are you going to call it out: 
  - yara honestly im gonna analyse in depth whats the issue, is the mistake actually a mistake or another misunderstanding, whatever it may be, whats the solution is its always gonna be communication, i would want to clear it out, 10 times, 100 times, 1000 times, no matter how much, until we re chill pill again~`,
  15: `Sannah Helwah Zaina. Here to another year of our most lovely, whimsy and kind hearted Zai to celebrate and feel the love of her surroundings. I pray that your health remains strong and good, I wish for your days to be blissful and cheery, I hope for the bad days to untangle itself with ease whenever it comes and I wants her to know that she is loved and cared by everyones who has known her as her closest of all. My selfish request would be for you to feel, feel and receive all the love without feeling guilty of it because you deserve all the goods that may come your way as easy as the ebb in the river. Love you my pretty little bambi, stay blessed and safe I am always here for whenever you need me. One text and one call away. Lovely yours, Byo.`,
  16: `hey Zaina, Happiest birthday to You!!!~~~~ 
  cheers to you, cheers to us for making through another year of your amazing life together! i have wrote so much that im literally out of words and have no idea what to wirte anymore but what id like to say is, which i can say thousands more times btw is 'im so fucking proud of you man' youre so strong
  and yk what thats what makes me worry about you the most. i want you to rely on me, rely on us, i want to hear you out, i want you to call me out, i want to spend lots of times with you, do lots of things with you, we literlly havent done anything at all yet together!!! we have whole our life left ahead of us we gotta make the most of it!!!
  ive noticed you being distant, ive noticed your change in texts, your tone, ive noticed for mood falls ive noticed it all and it just hurts so much to know i cant do anything about it. i want to be by your side, i want you to rely on me, i want you to trust me. i want to change for u yara.
  overall cheers 2 u being 19 woohooo lezz gourr man we re almost 20 wtf im freaking out 
  (ps: i need birthday party in an amazing restaurant *smiley*)`,
  17:`zaza sometimes we feel sad, regretful or depressed thinking about past actions and choices we made but these choices are what makes us US today. each decision sometimes i feel like butterfly effect is real cuz idk cuz if certain events didnt happened in our life, no matter how painful were they, they are what makes us US today.. and all the people we met in our life? im grateful for them too for giving us beautiful experiences, they taught us something, they changed something in us, they improvised us, they ruined something in us so that we could focus on our weakness, and that whats makes us who we are today. the more experience one has, the more better they become.`,
  18:`i was looking at our old gaming screenshots and hahaha we have changed so much yet we are still the same, the outer layer has changed but the inner essence remains the same.. do you get what im tryna say? 
  
etto what im saying is that whenever the kittens get lost, they always find their way back home, and for me, you and byo have been the one for me..the safe space that feels like home so yeah.. (using kittens is just a reference i couldnt think of anything else)`,
  19:`happy birthday yara i want party`,
};

// Confirmation Popup Component (generic)
function ConfirmationPopup({ title, message, onConfirm, onCancel, confirmText = "Yes", cancelText = "Cancel", confirmColor = "#8B2A2A" }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '300px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27' }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '20px' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onConfirm}
            style={{
              background: confirmColor,
              color: '#fff',
              border: '2px solid ' + confirmColor,
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            style={{
              background: '#7C8B6A',
              color: '#fff',
              border: '2px solid #5A6B4A',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Success Popup Component (generic)
function SuccessPopup({ message, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '280px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>✨</div>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '15px', color: '#3E2B27', fontWeight: 'bold' }}>
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: '#7C8B6A',
            color: '#fff',
            border: '2px solid #5A6B4A',
            padding: '8px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}
        >
          yay! ♡
        </button>
      </div>
    </div>
  );
}

// New Project Popup
function NewProjectPopup({ onConfirm, onCancel }) {
  const [projectName, setProjectName] = useState('');

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '320px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27', textAlign: 'center' }}>
          create new corkboard? ♡
        </h3>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="project name here..."
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: '2px solid #8B7355',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (projectName.trim()) {
                onConfirm(projectName.trim());
              }
            }}
            style={{
              flex: 1,
              background: '#4CAF50',
              color: '#fff',
              border: '2px solid #45a049',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          >
            done! ♡
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: '#9E9E9E',
              color: '#fff',
              border: '2px solid #757575',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Save/Load Manager Component
function SaveLoadPopup({ onClose, onSave, onLoad, onSaveChanges, savedProjects, currentHasUnsavedChanges, currentProjectName }) {
  const [projectName, setProjectName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const hasLoadedProject = currentProjectName && currentProjectName !== 'My Corkboard';

  const handleDeleteProject = (projectName, e) => {
    e.stopPropagation();
    const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
    delete projects[projectName];
    localStorage.setItem('corkboardProjects', JSON.stringify(projects));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '400px',
          maxHeight: '80%',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontFamily: 'monospace', color: '#3E2B27' }}>💾 Save/Load</h3>
          <button
            onClick={onClose}
            style={{
              background: '#8B2A2A',
              color: '#fff',
              border: 'none',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {currentHasUnsavedChanges && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            padding: '10px',
            marginBottom: '15px',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#856404'
          }}>
            ⚠️ You have unsaved changes!
          </div>
        )}

        {/* Save Section */}
        <div style={{ marginBottom: '20px' }}>
          {/* Show "Save Changes" button if a project is loaded with unsaved changes */}
          {hasLoadedProject && currentHasUnsavedChanges && (
            <button
              onClick={() => {
                onSaveChanges(currentProjectName);
              }}
              style={{
                width: '100%',
                background: '#FF9800',
                color: '#fff',
                border: '2px solid #F57C00',
                padding: '12px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: 'monospace',
                marginBottom: '10px'
              }}
            >
              💾 Save Changes to "{currentProjectName}"
            </button>
          )}

          {!showSaveInput ? (
            <button
              onClick={() => setShowSaveInput(true)}
              style={{
                width: '100%',
                background: '#2196F3',
                color: '#fff',
                border: '2px solid #1976D2',
                padding: '12px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}
            >
              💾 Save As New Project
            </button>
          ) : (
            <div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  border: '2px solid #8B7355',
                  borderRadius: '5px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    if (projectName.trim()) {
                      onSave(projectName.trim());
                      setProjectName('');
                      setShowSaveInput(false);
                    }
                  }}
                  style={{
                    flex: 1,
                    background: '#2196F3',
                    color: '#fff',
                    border: '2px solid #1976D2',
                    padding: '8px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSaveInput(false);
                    setProjectName('');
                  }}
                  style={{
                    flex: 1,
                    background: '#9E9E9E',
                    color: '#fff',
                    border: '2px solid #757575',
                    padding: '8px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Load Section */}
        <div>
          <h4 style={{ fontFamily: 'monospace', color: '#3E2B27', marginBottom: '10px' }}>
            Saved Projects:
          </h4>
          {savedProjects.length === 0 ? (
            <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666', textAlign: 'center' }}>
              No saved projects yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedProjects.map((project, index) => (
                <div
                  key={index}
                  style={{
                    background: '#fff',
                    border: '2px solid #8B7355',
                    borderRadius: '5px',
                    padding: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '14px' }}>
                      {project.name}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#666' }}>
                      {new Date(project.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => {
                        onLoad(project.name);
                      }}
                      style={{
                        background: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                      }}
                    >
                      Load
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(project.name, e)}
                      style={{
                        background: '#f44336',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// settings popup component
function SettingsPopup({ onClose, volume, setVolume, isPlaying, toggleMusic }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '250px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27', textAlign: 'center' }}>
          Settings
        </h3>
        
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleMusic}
            style={{
              background: isPlaying ? '#4CAF50' : '#9E9E9E',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {isPlaying ? '🔊' : '🔇'}
          </button>
          <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
            {isPlaying ? 'Music On' : 'Music Off'}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <span style={{ fontFamily: 'monospace', fontSize: '14px', minWidth: '60px' }}>Volume:</span>
  <input
    type="range"
    min="0"
    max="1"
    step="0.1"
    value={volume}
    onChange={(e) => setVolume(parseFloat(e.target.value))}
    style={{
      width: '120px',
      background: `linear-gradient(to right, #8B7355 0%, #8B7355 ${volume * 100}%, #e0e0e0 ${volume * 100}%, #e0e0e0 100%)`,
      borderRadius: '10px',
      outline: 'none',
      WebkitAppearance: 'none',
      height: '6px'
    }}
    // Webkit (Chrome, Safari, Edge)
    onMouseDown={(e) => {
      e.target.style.background = `linear-gradient(to right, #6B553A 0%, #6B553A ${volume * 100}%, #d0d0d0 ${volume * 100}%, #d0d0d0 100%)`;
    }}
    onMouseUp={(e) => {
      e.target.style.background = `linear-gradient(to right, #8B7355 0%, #8B7355 ${volume * 100}%, #e0e0e0 ${volume * 100}%, #e0e0e0 100%)`;
    }}
  />
  <span style={{ fontFamily: 'monospace', fontSize: '12px', minWidth: '30px' }}>
    {Math.round(volume * 100)}%
  </span>
</div>
        
        <button
          onClick={onClose}
          style={{
            marginTop: '15px',
            width: '100%',
            background: '#8B2A2A',
            color: '#fff',
            border: '2px solid #5A1A1A',
            padding: '8px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// context menu component
function ContextMenu({ position, onMoveToBack, onMoveToFront, onDelete, onDuplicate, onMoveToVeryFront, isAtBack }) {
  return (
    <div
      style={{
        position: 'absolute',  // Changed from 'fixed' to 'absolute'
        left: position.x,
        top: position.y,
        background: '#fff',
        border: '2px solid #8B7355',
        borderRadius: '5px',
        padding: '5px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 3000,
        minWidth: '150px'
      }}
    >
      <button
        onClick={onMoveToVeryFront}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '8px 12px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#2196F3'
        }}
        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        ⭐ Move to Very Front
      </button>
      <button
        onClick={isAtBack ? onMoveToFront : onMoveToBack}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '8px 12px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}
        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        {isAtBack ? '⬆️ Move to Front' : '⬇️ Move to Back'}
      </button>
      <button
        onClick={onDuplicate}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '8px 12px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}
        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        📋 Duplicate
      </button>
      <button
        onClick={onDelete}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '8px 12px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#ff0000'
        }}
        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        🗑️ Delete
      </button>
    </div>
  );
}

// delete confirmation popup
function DeleteConfirmation({ onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '300px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27' }}>
          Confirm Delete
        </h3>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '20px' }}>
          Are you sure you want to delete this item?
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onConfirm}
            style={{
              background: '#8B2A2A',
              color: '#fff',
              border: '2px solid #5A1A1A',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            style={{
              background: '#7C8B6A',
              color: '#fff',
              border: '2px solid #5A6B4A',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Export Success Popup - UPDATED TO BE CUTER AND SMALLER
function ExportSuccessPopup({ onClose, onShare, hasShareAPI }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '12px',
          padding: '20px',
          width: '280px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>✨</div>
        <h3 style={{ margin: '0 0 8px 0', fontFamily: 'monospace', color: '#3E2B27', fontSize: '16px' }}>
          yay! exported! ♡
        </h3>
        <p style={{ fontFamily: 'monospace', fontSize: '12px', marginBottom: '15px', color: '#666' }}>
          ur corkboard is saved~
        </p>
        
        {hasShareAPI && (
          <button
            onClick={onShare}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: '2px solid #5a67d8',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
              fontFamily: 'monospace',
              marginBottom: '8px'
            }}
          >
            share it! ♡
          </button>
        )}
        
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: '#7C8B6A',
            color: '#fff',
            border: '2px solid #5A6B4A',
            padding: '8px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
            fontFamily: 'monospace'
          }}
        >
          close ♡
        </button>
      </div>
    </div>
  );
}

// draggable, resizable, rotatable item component with improved Figma-like controls
function InteractiveItem({ 
  children, 
  initialPosition, 
  initialSize = { width: 150, height: 150 },
  initialRotation = 0,
  onPositionChange, 
  onSizeChange,
  onRotationChange,
  onDelete,
  onDuplicate,
  onZIndexChange,
  zIndex,
  isAtBack,
  type,
  id
}) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [rotation, setRotation] = useState(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('control-handle') || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    setIsDragging(true);
    setIsSelected(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.stopPropagation();
  };

  const handleRightClick = (e) => {
  e.preventDefault();
  
  // Get the corkboard container bounds
  const corkboardRect = e.currentTarget.closest('[ref="corkboardRef"]')?.getBoundingClientRect() || 
                        e.currentTarget.offsetParent?.getBoundingClientRect();
  
  // Context menu dimensions
  const menuWidth = 150;
  const menuHeight = 160; // approximate height
  
  // Calculate position relative to the item
  let menuX = e.clientX;
  let menuY = e.clientY;
  
  if (corkboardRect) {
    // Convert to relative position within corkboard
    menuX = e.clientX - corkboardRect.left;
    menuY = e.clientY - corkboardRect.top;
    
    // Adjust if menu would overflow right edge
    if (menuX + menuWidth > corkboardRect.width) {
      menuX = corkboardRect.width - menuWidth - 10;
    }
    
    // Adjust if menu would overflow bottom edge
    if (menuY + menuHeight > corkboardRect.height) {
      menuY = corkboardRect.height - menuHeight - 10;
    }
    
    // Keep minimum distance from edges
    menuX = Math.max(10, menuX);
    menuY = Math.max(10, menuY);
  }
  
  setContextMenuPosition({ x: menuX, y: menuY });
  setShowContextMenu(true);
  setIsSelected(true);
};

  const handleResizeMouseDown = (e, corner) => {
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y,
      corner: corner
    });
    e.stopPropagation();
  };

  const handleRotateMouseDown = (e) => {
    setIsRotating(true);
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        setPosition(newPosition);
        if (onPositionChange) onPositionChange(newPosition);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        switch(resizeStart.corner) {
          case 'se':
            newWidth = Math.max(50, resizeStart.width + deltaX);
            newHeight = Math.max(50, resizeStart.height + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(50, resizeStart.width - deltaX);
            newHeight = Math.max(50, resizeStart.height + deltaY);
            if (newWidth >= 50) newX = resizeStart.posX + deltaX;
            break;
          case 'ne':
            newWidth = Math.max(50, resizeStart.width + deltaX);
            newHeight = Math.max(50, resizeStart.height - deltaY);
            if (newHeight >= 50) newY = resizeStart.posY + deltaY;
            break;
          case 'nw':
            newWidth = Math.max(50, resizeStart.width - deltaX);
            newHeight = Math.max(50, resizeStart.height - deltaY);
            if (newWidth >= 50) newX = resizeStart.posX + deltaX;
            if (newHeight >= 50) newY = resizeStart.posY + deltaY;
            break;
        }

        const newSize = { width: newWidth, height: newHeight };
        const newPos = { x: newX, y: newY };
        setSize(newSize);
        setPosition(newPos);
        if (onSizeChange) onSizeChange(newSize);
        if (onPositionChange) onPositionChange(newPos);
      } else if (isRotating) {
        const centerX = position.x + size.width / 2;
        const centerY = position.y + size.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
        setRotation(angle);
        if (onRotationChange) onRotationChange(angle);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsRotating(false);
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest('.interactive-item') && !e.target.closest('.context-menu')) {
        setIsSelected(false);
        setShowContextMenu(false);
      }
    };

    if (isDragging || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDragging, isResizing, isRotating, dragOffset, position, size, resizeStart, onPositionChange, onSizeChange, onRotationChange]);

  const handleMoveToBack = () => {
    if (onZIndexChange) onZIndexChange('back');
    setShowContextMenu(false);
  };

  const handleMoveToFront = () => {
    if (onZIndexChange) onZIndexChange('front');
    setShowContextMenu(false);
  };

  const handleMoveToVeryFront = () => {
    if (onZIndexChange) onZIndexChange('veryfront');
    setShowContextMenu(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setShowContextMenu(false);
  };

  const handleDuplicateClick = () => {
    if (onDuplicate) onDuplicate();
    setShowContextMenu(false);
  };

  const confirmDelete = () => {
    if (onDelete) onDelete();
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        className="interactive-item"
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          transform: `rotate(${rotation}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: zIndex || 10,
          userSelect: 'none',
          outline: isSelected ? '2px solid #2196F3' : 'none',
          outlineOffset: '2px'
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleRightClick}
      >
        {children}
        
        {/* Figma-like resize handles - only show when selected */}
        {isSelected && (
          <>
            {/* Corner handles */}
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                top: '-6px',
                left: '-6px',
                width: '12px',
                height: '12px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nwse-resize',
                zIndex: 1000
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
            />
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '12px',
                height: '12px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nesw-resize',
                zIndex: 1000
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
            />
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '-6px',
                width: '12px',
                height: '12px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nesw-resize',
                zIndex: 1000
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
            />
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                width: '12px',
                height: '12px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nwse-resize',
                zIndex: 1000
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            />
            
            {/* Rotation handle */}
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '50%',
                cursor: 'crosshair',
                zIndex: 1000
              }}
              onMouseDown={handleRotateMouseDown}
            >
              <div style={{
                position: 'absolute',
                width: '2px',
                height: '14px',
                background: '#2196F3',
                left: '50%',
                bottom: '100%',
                transform: 'translateX(-50%)'
              }} />
            </div>
          </>
        )}
      </div>

      {showContextMenu && (
        <div className="context-menu">
          <ContextMenu
            position={contextMenuPosition}
            onMoveToBack={handleMoveToBack}
            onMoveToFront={handleMoveToFront}
            onMoveToVeryFront={handleMoveToVeryFront}
            onDelete={handleDelete}
            onDuplicate={handleDuplicateClick}
            isAtBack={isAtBack}
          />
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmation
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}
// letter popup component
function LetterPopup({ letterNumber, onClose, onReaction }) {
  const [reaction, setReaction] = useState(null);
  const content = letterContents[letterNumber] || "Letter not found :(";

  const reactions = ['❤️', '🥺', '😭', '🥰', '✨', '💕'];

  const handleReaction = (emoji) => {
    setReaction(emoji);
    if (onReaction) onReaction(letterNumber, emoji);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          backgroundImage: `
            linear-gradient(to bottom, #fff8dc 0%, #fffacd 100%),
            repeating-linear-gradient(
              transparent,
              transparent 20px,
              #e8dab2 20px,
              #e8dab2 21px
            )
          `,
          border: '2px solid #8B7355',
          borderRadius: '5px',
          width: '350px',
          height: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Courier New, monospace'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div
          style={{
            background: 'linear-gradient(to right, #D4A574, #C19A6B)',
            padding: '6px 10px',
            borderTopLeftRadius: '3px',
            borderTopRightRadius: '3px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #8B7355'
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#3E2B27' }}>
            ✉️ Letter #{letterNumber}
          </span>
          <button
            onClick={onClose}
            style={{
              background: '#8B2A2A',
              border: '1px solid #5A1A1A',
              color: '#fff',
              width: '20px',
              height: '20px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>

        {/* content */}
        <div
          style={{
            flex: 1,
            padding: '20px 12px 12px 35px',
            overflowY: 'auto',
            position: 'relative'
          }}
        >
          {/* left margin line */}
          <div
            style={{
              position: 'absolute',
              left: '25px',
              top: 0,
              bottom: 0,
              width: '1px',
              background: '#e8dab2'
            }}
          />
          
          <pre
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '10px',
              lineHeight: '20px',
              color: '#2A1F1D',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {content}
          </pre>
        </div>

        {/* reactions footer */}
        <div
          style={{
            background: 'linear-gradient(to right, #F5DEB3, #DEB887)',
            padding: '6px 10px',
            borderBottomLeftRadius: '3px',
            borderBottomRightRadius: '3px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #8B7355'
          }}
        >
          <div style={{ display: 'flex', gap: '5px' }}>
            {reactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                style={{
                  background: reaction === emoji ? '#FFD700' : 'transparent',
                  border: reaction === emoji ? '1px solid #8B7355' : '1px solid transparent',
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  transition: 'all 0.2s'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '9px', color: '#5A4A3A', fontWeight: 'bold' }}>
            {reaction ? `${reaction}` : 'React!'}
          </span>
        </div>
      </div>
    </div>
  );
}

// sticker gallery popup component
function StickerGalleryPopup({ onClose, onAddSticker }) {
  const defaultStickers = [
    '/corkboard/sticker1.png',
    '/corkboard/sticker2.png',
    '/corkboard/sticker3.png',
    '/corkboard/sticker4.png',
    '/corkboard/sticker5.png',
    '/corkboard/sticker6.png',
    '/corkboard/sticker8.png',
    '/corkboard/sticker9.png',
    '/corkboard/sticker10.png',
    '/corkboard/sticker11.png',
    '/corkboard/sticker12.png',
    '/corkboard/sticker13.png',
    '/corkboard/sticker14.png',
    '/corkboard/sticker15.png',
    '/corkboard/sticker16.png',
    '/corkboard/sticker17.png',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '400px',
          maxHeight: '80%',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, fontFamily: 'monospace', color: '#3E2B27' }}>✨ Sticker Gallery</h3>
          <button
            onClick={onClose}
            style={{
              background: '#8B2A2A',
              color: '#fff',
              border: 'none',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '15px'
        }}>
          {defaultStickers.map((src, i) => (
            <div
              key={i}
              onClick={() => onAddSticker(src)}
              style={{
                cursor: 'pointer',
                background: '#fff',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
                transform: 'scale(1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={src}
                alt={`sticker ${i + 1}`}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// gallery popup component for polaroids
function GalleryPopup({ onClose, onAddPolaroid }) {
  const polaroidImages = Array.from({ length: 9 }, (_, i) => `/corkboard/polaroids/${i + 1}.png`);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '500px',
          maxHeight: '80%',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, fontFamily: 'monospace', color: '#3E2B27' }}>📸 Polaroid Gallery</h3>
          <button
            onClick={onClose}
            style={{
              background: '#8B2A2A',
              color: '#fff',
              border: 'none',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '15px'
        }}>
          {polaroidImages.map((src, i) => (
            <div
              key={i}
              onClick={() => onAddPolaroid(src)}
              style={{
                cursor: 'pointer',
                background: '#fff',
                padding: '8px',
                paddingBottom: '30px',
                boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={src}
                alt={`polaroid ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Updated generateStarPositions function with better distribution
const generateStarPositions = (isFullscreen = false) => {
  const positions = [];
  
  // Adjust boundaries based on mode
  const topMargin = isFullscreen ? 15 : 5; // Less top space when not fullscreen
  const sideMargin = isFullscreen ? 5 : 8;
  const bottomMargin = isFullscreen ? 8 : 8;
  
  // Grid configuration - more columns for better distribution
  const cols = isFullscreen ? 6 : 5;
  const rows = isFullscreen ? 4 : 4;
  
  // Calculate spacing
  const horizontalSpacing = (100 - (sideMargin * 2)) / (cols - 1);
  const verticalSpacing = (80 - topMargin - bottomMargin) / (rows - 1);
  
  let starIndex = 0;
  const usedPositions = new Set();
  
  // Create grid positions first
  const gridPositions = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const baseX = sideMargin + (horizontalSpacing * col);
      const baseY = topMargin + (verticalSpacing * row);
      gridPositions.push({ baseX, baseY });
    }
  }
  
  // Shuffle grid positions for random distribution
  const shuffledPositions = [...gridPositions].sort(() => Math.random() - 0.5);
  
  // Assign stars to shuffled grid positions with slight random offset
  for (const { baseX, baseY } of shuffledPositions) {
    if (starIndex >= 19) break;
    
    // Add controlled random offset (max 25% of spacing)
    const maxOffsetX = horizontalSpacing * 0.25;
    const maxOffsetY = verticalSpacing * 0.25;
    
    const randomOffsetX = (Math.random() - 0.5) * maxOffsetX;
    const randomOffsetY = (Math.random() - 0.5) * maxOffsetY;
    
    let x = baseX + randomOffsetX;
    let y = baseY + randomOffsetY;
    
    // Ensure positions stay within safe boundaries
    x = Math.max(sideMargin + 5, Math.min(100 - sideMargin - 5, x));
    y = Math.max(topMargin + 5, Math.min(100 - bottomMargin - 5, y));
    
    // Check if this position is too close to existing ones
    const isTooClose = Array.from(usedPositions).some(pos => {
      const dx = Math.abs(pos.x - x);
      const dy = Math.abs(pos.y - y);
      return dx < horizontalSpacing * 0.6 && dy < verticalSpacing * 0.6;
    });
    
    if (!isTooClose) {
      positions.push({ x, y });
      usedPositions.add({ x, y });
      starIndex++;
    }
  }
  
  // If we still need positions, add them with minimum distance
  while (positions.length < 19) {
    const x = sideMargin + 5 + Math.random() * (100 - sideMargin * 2 - 10);
    const y = topMargin + 5 + Math.random() * (100 - topMargin - bottomMargin - 10);
    
    // Check minimum distance from existing positions
    const isFarEnough = Array.from(usedPositions).every(pos => {
      const dx = Math.abs(pos.x - x);
      const dy = Math.abs(pos.y - y);
      return dx > horizontalSpacing * 0.8 || dy > verticalSpacing * 0.8;
    });
    
    if (isFarEnough) {
      positions.push({ x, y });
      usedPositions.add({ x, y });
    }
  }
  
  return positions;
};

// Star component remains the same but with adjusted size
function Star({ letterNumber, position, isFullscreen, onLetterClick, reaction }) {
  const starSize = isFullscreen ? 40 : 15;
  const [isHovered, setIsHovered] = useState(false);
  
  const colors = [
    '#FF6B6B', '#FFD166', '#06D6A0', '#4ECDC4', 
    '#EF476F', '#118AB2', '#FF9E6D', '#6A0572',
    '#6495ED', '#B0C4DE', '#FFB3BA', '#BAFFC9'
  ];
  
  const starColor = colors[(letterNumber - 1) % colors.length];
  
  return (
    <div
      onClick={() => onLetterClick(letterNumber)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${starSize}px`,
        height: `${starSize}px`,
        opacity: '50%',
        cursor: 'pointer',
        zIndex: 5,
        transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.2)' : 'scale(1)'}`,
        transition: 'transform 0.2s ease',
        filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8))',
      }}
    >
      <svg viewBox="0 0 51 48" fill={starColor} stroke="#000" strokeWidth="1.5">
        <path d="M25,2 L30,17 L46,17 L33,27 L38,42 L25,32 L12,42 L17,27 L4,17 L20,17 Z" />
      </svg>
      {reaction && (
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: isFullscreen ? '12px' : '10px',
          zIndex: 6,
          textShadow: '0 0 3px rgba(255,255,255,0.8)'
        }}>
          {reaction}
        </div>
      )}
    </div>
  );
}
// main corkboard app
function CorkboardApp({ isFullscreen = false }) {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [polaroids, setPolaroids] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showStickerGallery, setShowStickerGallery] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reactions, setReactions] = useState({});
  const [currentProjectName, setCurrentProjectName] = useState('My Corkboard');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [exportedImageBlob, setExportedImageBlob] = useState(null);
  const [exportedImageFilename, setExportedImageFilename] = useState('');
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);
  const [loadProjectName, setLoadProjectName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProjectName, setDeleteProjectName] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isWindowFullscreen, setIsWindowFullscreen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [savedProjectsCache, setSavedProjectsCache] = useState([]);
  const [starPositions, setStarPositions] = useState(() => generateStarPositions(false));
  
  const clickAudioRef = useRef(null);
  const paperAudioRef = useRef(null);
  const musicAudioRef = useRef(null);
  const fileInputRef = useRef(null);
  const corkboardRef = useRef(null);

  const shouldShowToolbar = isFullscreen;
  const shouldShowHamburger = !isFullscreen;

  const [assetsLoaded, setAssetsLoaded] = useState(false);

useEffect(() => {
  lazyLoadAssets(CORKBOARD_ASSETS).then(() => {
    setAssetsLoaded(true);
  });
}, []);

if (!assetsLoaded) {
  return <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'monospace', fontSize: '18px', color: '#8B7355' }}>Loading corkboard...</div>;
}

  // Listen for storage events to update saved projects
  useEffect(() => {
    const handleStorageChange = () => {
      setSavedProjectsCache(getSavedProjects());
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for same-tab updates
    window.addEventListener('projectsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('projectsUpdated', handleStorageChange);
    };
  }, []);
  
  // Regenerate star positions when fullscreen changes
  // In your CorkboardApp component, update this useEffect:
useEffect(() => {
  setStarPositions(generateStarPositions(isFullscreen));
}, [isFullscreen]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('corkboardCurrentState');
      if (savedState) {
        const state = JSON.parse(savedState);
        setStickyNotes(state.stickyNotes || []);
        setPolaroids(state.polaroids || []);
        setStickers(state.stickers || []);
        setReactions(state.reactions || {});
        setCurrentProjectName(state.projectName || 'My Corkboard');
      }
      setIsLoaded(true);
      setSavedProjectsCache(getSavedProjects());
    } catch (error) {
      console.error('Error loading state:', error);
      setIsLoaded(true);
    }
  }, []);

  // Auto-save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    
    const timeoutId = setTimeout(() => {
      try {
        const state = {
          stickyNotes,
          polaroids,
          stickers,
          reactions,
          projectName: currentProjectName,
          timestamp: Date.now()
        };
        localStorage.setItem('corkboardCurrentState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state:', error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [stickyNotes, polaroids, stickers, reactions, currentProjectName, isLoaded]);

  // Track unsaved changes
  useEffect(() => {
    if (isLoaded && (stickyNotes.length > 0 || polaroids.length > 0 || stickers.length > 0)) {
      setHasUnsavedChanges(true);
    }
  }, [stickyNotes, polaroids, stickers, isLoaded]);

  // initialize audio
useEffect(() => {
  clickAudioRef.current = new Audio('/corkboard/audio/click.mp3');
  paperAudioRef.current = new Audio('/corkboard/audio/paper.mp3');
  musicAudioRef.current = new Audio('/corkboard/audio/music.mp3');
  
  if (musicAudioRef.current) {
    musicAudioRef.current.loop = true;
    musicAudioRef.current.volume = volume;
    
    // Auto-play music on load
    if (isPlaying) {
      musicAudioRef.current.play().catch(e => console.log('Music autoplay failed:', e));
    }
  }
  
  // Cleanup
  return () => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current = null;
    }
  };
}, []); // Only run once on mount

  // update volume
useEffect(() => {
  if (musicAudioRef.current) {
    musicAudioRef.current.volume = volume;
  }
  if (clickAudioRef.current) {
    clickAudioRef.current.volume = volume;
  }
  if (paperAudioRef.current) {
    paperAudioRef.current.volume = volume;
  }
}, [volume]);

  // handle music play/pause
  // Replace your current music play/pause useEffect with this:
useEffect(() => {
  if (musicAudioRef.current) {
    if (isPlaying) {
      musicAudioRef.current.play().catch(e => console.log('Music play failed:', e));
    } else {
      musicAudioRef.current.pause();
    }
  }

  // Cleanup function to stop music when component unmounts
  return () => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0; // Reset to beginning
    }
  };
}, [isPlaying]);

// Also add this cleanup useEffect for when the app completely unmounts:
useEffect(() => {
  return () => {
    // Comprehensive cleanup when component unmounts
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0;
      musicAudioRef.current = null;
    }
    if (clickAudioRef.current) {
      clickAudioRef.current = null;
    }
    if (paperAudioRef.current) {
      paperAudioRef.current = null;
    }
  };
}, []);

  const playSound = (type) => {
  try {
    if (type === 'click' && clickAudioRef.current) {
      const audio = clickAudioRef.current.cloneNode();
      audio.volume = volume; // Use current volume state
      audio.play().catch(e => console.log('Audio play failed:', e));
    } else if (type === 'paper' && paperAudioRef.current) {
      const audio = paperAudioRef.current.cloneNode();
      audio.volume = volume; // Use current volume state
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  } catch (error) {
    console.log('Audio play failed:', error);
  }
};

  const handleLetterClick = (letterNumber) => {
    setSelectedLetter(letterNumber);
    playSound('paper');
  };

  const handleCloseLetter = () => {
    setSelectedLetter(null);
  };

  const handleReaction = (letterNumber, emoji) => {
    setReactions(prev => ({
      ...prev,
      [letterNumber]: emoji
    }));
  };

  const handleAddStickyNote = () => {
  playSound('paper');
  // Get the highest z-index from all items
  const allZIndexes = [
    ...stickyNotes.map(n => n.zIndex),
    ...polaroids.map(p => p.zIndex),
    ...stickers.map(s => s.zIndex)
  ];
  const maxZ = allZIndexes.length > 0 ? Math.max(...allZIndexes) : 10;
  
  const newNote = {
    id: Date.now(),
    position: { x: 100 + stickyNotes.length * 20, y: 150 + stickyNotes.length * 20 },
    size: { width: 150, height: 150 },
    rotation: Math.random() * 10 - 5,
    zIndex: maxZ + 1, // Stack on top
    isAtBack: false,
    content: '',
    color: ['#FFFF88', '#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA'][stickyNotes.length % 5]
  };
  setStickyNotes([...stickyNotes, newNote]);
  setShowMobileMenu(false);
};

  const handleAddPolaroid = (src) => {
  playSound('click');
  // Get the highest z-index from all items
  const allZIndexes = [
    ...stickyNotes.map(n => n.zIndex),
    ...polaroids.map(p => p.zIndex),
    ...stickers.map(s => s.zIndex)
  ];
  const maxZ = allZIndexes.length > 0 ? Math.max(...allZIndexes) : 10;
  
  const newPolaroid = {
    id: Date.now(),
    src: src,
    position: { x: 200 + polaroids.length * 30, y: 200 + polaroids.length * 30 },
    size: { width: 150, height: 180 },
    rotation: Math.random() * 10 - 5,
    zIndex: maxZ + 1, // Stack on top
    isAtBack: false
  };
  setPolaroids([...polaroids, newPolaroid]);
  setShowGallery(false);
  setShowMobileMenu(false);
};
  const handleAddSticker = (src) => {
  playSound('click');
  // Get the highest z-index from all items
  const allZIndexes = [
    ...stickyNotes.map(n => n.zIndex),
    ...polaroids.map(p => p.zIndex),
    ...stickers.map(s => s.zIndex)
  ];
  const maxZ = allZIndexes.length > 0 ? Math.max(...allZIndexes) : 10;
  
  const newSticker = {
    id: Date.now(),
    src: src,
    position: { x: 200 + stickers.length * 20, y: 200 + stickers.length * 20 },
    size: { width: 100, height: 100 },
    rotation: Math.random() * 10 - 5,
    zIndex: maxZ + 1, // Stack on top
    isAtBack: false
  };
  setStickers([...stickers, newSticker]);
  setShowStickerGallery(false);
  setShowMobileMenu(false);
};

  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      // Get the highest z-index from all items
      const allZIndexes = [
        ...stickyNotes.map(n => n.zIndex),
        ...polaroids.map(p => p.zIndex),
        ...stickers.map(s => s.zIndex)
      ];
      const maxZ = allZIndexes.length > 0 ? Math.max(...allZIndexes) : 10;
      
      const newSticker = {
        id: Date.now(),
        src: event.target.result,
        position: { x: 200, y: 200 },
        size: { width: 100, height: 100 },
        rotation: 0,
        zIndex: maxZ + 1, // Stack on top
        isAtBack: false
      };
      setStickers([...stickers, newSticker]);
      playSound('click');
    };
    reader.readAsDataURL(file);
  }
  setShowMobileMenu(false);
};

  const toggleMusic = () => {
  setIsPlaying(prev => !prev);
};

  // Get saved projects
  const getSavedProjects = () => {
    try {
      const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
      return Object.values(projects).sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  };

  // Save current project to named slot
  const handleSaveProject = (projectName) => {
    try {
      const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
      projects[projectName] = {
        name: projectName,
        stickyNotes,
        polaroids,
        stickers,
        reactions,
        timestamp: Date.now()
      };
      localStorage.setItem('corkboardProjects', JSON.stringify(projects));
      setCurrentProjectName(projectName);
      setHasUnsavedChanges(false);
      
      // Show success message
      setSuccessMessage(`yay! "${projectName}" saved successfully! ♡`);
      setShowSuccessMessage(true);
      
      // Update cache and trigger event
      setSavedProjectsCache(getSavedProjects());
      window.dispatchEvent(new Event('projectsUpdated'));
      
      playSound('click');
    } catch (error) {
      console.error('Error saving project:', error);
      setSuccessMessage('oopsie! failed to save. try again? ♡');
      setShowSuccessMessage(true);
    }
  };

  // Load project from saved slot
  const handleLoadProject = (projectName) => {
    // If has unsaved changes, show warning
    if (hasUnsavedChanges) {
      setLoadProjectName(projectName);
      setShowLoadConfirm(true);
      return;
    }
    
    loadProjectDirectly(projectName);
  };

  const loadProjectDirectly = (projectName) => {
    try {
      const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
      const project = projects[projectName];
      if (project) {
        setStickyNotes(project.stickyNotes || []);
        setPolaroids(project.polaroids || []);
        setStickers(project.stickers || []);
        setReactions(project.reactions || {});
        setCurrentProjectName(project.name);
        setHasUnsavedChanges(false);
        
        setSuccessMessage(`"${projectName}" loaded! ♡`);
        setShowSuccessMessage(true);
        setShowSaveLoad(false);
        setShowLoadConfirm(false);
        
        playSound('click');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setSuccessMessage('oopsie! failed to load. try again? ♡');
      setShowSuccessMessage(true);
    }
  };

  // Handle new project button click
  const handleNewProjectClick = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      setShowNewProjectPopup(true);
    }
    setShowSaveLoad(false);
  };

  // Create new project
  const handleCreateNewProject = (projectName) => {
    setStickyNotes([]);
    setPolaroids([]);
    setStickers([]);
    setReactions({});
    setCurrentProjectName(projectName);
    setHasUnsavedChanges(false);
    setShowNewProjectPopup(false);
    setShowUnsavedWarning(false);
    
    setSuccessMessage(`new corkboard "${projectName}" created! ♡`);
    setShowSuccessMessage(true);
    
    playSound('click');
  };

  // Delete project with confirmation
  const handleDeleteProjectClick = (projectName) => {
    setDeleteProjectName(projectName);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProjectConfirm = () => {
    try {
      const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
      delete projects[deleteProjectName];
      localStorage.setItem('corkboardProjects', JSON.stringify(projects));
      
      // Update cache and trigger event
      setSavedProjectsCache(getSavedProjects());
      window.dispatchEvent(new Event('projectsUpdated'));
      
      setShowDeleteConfirm(false);
      setDeleteProjectName('');
      
      setSuccessMessage(`"${deleteProjectName}" deleted! ♡`);
      setShowSuccessMessage(true);
      
      playSound('click');
    } catch (error) {
      console.error('Error deleting project:', error);
      setSuccessMessage('oopsie! failed to delete. try again? ♡');
      setShowSuccessMessage(true);
    }
  };

  // Export/Share corkboard as image - WITH CONFIRMATION POPUP
  const handleExportClick = () => {
    setShowExportConfirm(true);
  };

  const handleExportConfirm = async () => {
  setShowExportConfirm(false);
  
  const toolbar = document.querySelector('.toolbar');
  const hamburger = document.querySelector('.hamburger-menu');
  
  try {
    if (!corkboardRef.current) {
      setSuccessMessage('oopsie! corkboard not ready. try again? ♡');
      setShowSuccessMessage(true);
      return;
    }

    // Check if html2canvas is available
    let html2canvas;
    
    if (window.html2canvas) {
      html2canvas = window.html2canvas;
    } else {
      try {
        const module = await import('html2canvas');
        html2canvas = module.default;
      } catch (e) {
        setSuccessMessage('export needs html2canvas library! ♡');
        setShowSuccessMessage(true);
        return;
      }
    }
    
    // Hide toolbar, hamburger menu and selection outlines temporarily
    if (toolbar) {
      toolbar.style.visibility = 'hidden';
    }
    if (hamburger) {
      hamburger.style.visibility = 'hidden';
    }
    
    // Hide all selection outlines
    const interactiveItems = document.querySelectorAll('.interactive-item');
    interactiveItems.forEach(item => {
      item.style.outline = 'none';
    });

    // Create a temporary container with the background as an actual image element
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = corkboardRef.current.offsetWidth + 'px';
    tempContainer.style.height = corkboardRef.current.offsetHeight + 'px';
    document.body.appendChild(tempContainer);

    // Add background image as an actual img element
    const bgImg = document.createElement('img');
    bgImg.src = '/corkboard/corkboard.jpg';
    bgImg.style.position = 'absolute';
    bgImg.style.top = '0';
    bgImg.style.left = '0';
    bgImg.style.width = '100%';
    bgImg.style.height = '100%';
    bgImg.style.objectFit = 'cover';
    tempContainer.appendChild(bgImg);

    // Clone the corkboard content
    const clonedContent = corkboardRef.current.cloneNode(true);
    clonedContent.style.position = 'absolute';
    clonedContent.style.top = '0';
    clonedContent.style.left = '0';
    clonedContent.style.width = '100%';
    clonedContent.style.height = '100%';
    clonedContent.style.background = 'none'; // Remove background from clone
    tempContainer.appendChild(clonedContent);

    // Wait for background image to load
    await new Promise((resolve) => {
      if (bgImg.complete) {
        resolve();
      } else {
        bgImg.onload = resolve;
        bgImg.onerror = resolve;
      }
    });

    // Wait for UI to update
    await new Promise(resolve => setTimeout(resolve, 300));

    // Capture the temporary container
    const canvas = await html2canvas(tempContainer, {
      backgroundColor: '#8B7355',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: tempContainer.offsetWidth,
      height: tempContainer.offsetHeight,
      x: 0,
      y: 0,
      windowWidth: tempContainer.offsetWidth,
      windowHeight: tempContainer.offsetHeight
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    // Restore toolbar and hamburger visibility
    if (toolbar) {
      toolbar.style.visibility = 'visible';
    }
    if (hamburger) {
      hamburger.style.visibility = 'visible';
    }

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `${currentProjectName.replace(/\s+/g, '_')}_${Date.now()}.png`;
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        // Store blob and filename for sharing
        setExportedImageBlob(blob);
        setExportedImageFilename(filename);
        
        // Show success popup
        setShowExportSuccess(true);
        playSound('click');
      } else {
        setSuccessMessage('oopsie! failed to create image. try again? ♡');
        setShowSuccessMessage(true);
      }
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('Error exporting image:', error);
    
    // Restore toolbar and hamburger visibility
    if (toolbar) {
      toolbar.style.visibility = 'visible';
    }
    if (hamburger) {
      hamburger.style.visibility = 'visible';
    }
    
    setSuccessMessage('export failed! make sure html2canvas is installed ♡');
    setShowSuccessMessage(true);
  }
};
  // Handle share from success popup
  const handleShareFromPopup = async () => {
    if (!exportedImageBlob || !exportedImageFilename) {
      setSuccessMessage('no image to share! export again? ♡');
      setShowSuccessMessage(true);
      return;
    }

    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([exportedImageBlob], exportedImageFilename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: currentProjectName,
            text: 'check out my corkboard! 🎨 ♡'
          });
          setShowExportSuccess(false);
        } else {
          setSuccessMessage('ur device cant share files! but its downloaded ♡');
          setShowSuccessMessage(true);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Share failed:', err);
          setSuccessMessage('share cancelled! but its downloaded ♡');
          setShowSuccessMessage(true);
        }
      }
    } else {
      setSuccessMessage('sharing not supported! but its downloaded ♡');
      setShowSuccessMessage(true);
    }
  };

  // Update sticky note
  const updateStickyNote = (id, field, value) => {
    setStickyNotes(stickyNotes.map(note =>
      note.id === id ? { ...note, [field]: value } : note
    ));
  };

  // Delete sticky note
  const deleteStickyNote = (id) => {
    setStickyNotes(stickyNotes.filter(note => note.id !== id));
    playSound('paper');
  };

  // Duplicate sticky note
  const duplicateStickyNote = (id) => {
    const note = stickyNotes.find(n => n.id === id);
    if (note) {
      const newNote = {
        ...note,
        id: Date.now(),
        position: { x: note.position.x + 20, y: note.position.y + 20 },
        zIndex: Math.max(...stickyNotes.map(n => n.zIndex)) + 1
      };
      setStickyNotes([...stickyNotes, newNote]);
      playSound('paper');
    }
  };

  // Update polaroid
  const updatePolaroid = (id, field, value) => {
    setPolaroids(polaroids.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Delete polaroid
  const deletePolaroid = (id) => {
    setPolaroids(polaroids.filter(p => p.id !== id));
    playSound('click');
  };

  // Duplicate polaroid
  const duplicatePolaroid = (id) => {
    const polaroid = polaroids.find(p => p.id === id);
    if (polaroid) {
      const newPolaroid = {
        ...polaroid,
        id: Date.now(),
        position: { x: polaroid.position.x + 20, y: polaroid.position.y + 20 },
        zIndex: Math.max(...polaroids.map(p => p.zIndex)) + 1
      };
      setPolaroids([...polaroids, newPolaroid]);
      playSound('click');
    }
  };

  // Update sticker
  const updateSticker = (id, field, value) => {
    setStickers(stickers.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  // Delete sticker
  const deleteSticker = (id) => {
    setStickers(stickers.filter(s => s.id !== id));
    playSound('click');
  };

  // Duplicate sticker
  const duplicateSticker = (id) => {
    const sticker = stickers.find(s => s.id === id);
    if (sticker) {
      const newSticker = {
        ...sticker,
        id: Date.now(),
        position: { x: sticker.position.x + 20, y: sticker.position.y + 20 },
        zIndex: Math.max(...stickers.map(s => s.zIndex)) + 1
      };
      setStickers([...stickers, newSticker]);
      playSound('click');
    }
  };

// Handle Z-Index changes
const handleZIndexChange = (id, type, direction) => {
  // Get all items with their z-indexes
  const allItems = [
    ...stickyNotes.map(n => ({ id: n.id, zIndex: n.zIndex, type: 'note' })),
    ...polaroids.map(p => ({ id: p.id, zIndex: p.zIndex, type: 'polaroid' })),
    ...stickers.map(s => ({ id: s.id, zIndex: s.zIndex, type: 'sticker' }))
  ];
  
  const maxZ = Math.max(...allItems.map(item => item.zIndex), 10);
  const minZ = Math.min(...allItems.map(item => item.zIndex), 10);
  
  if (type === 'note') {
    setStickyNotes(stickyNotes.map(note => {
      if (note.id === id) {
        if (direction === 'front') {
          return { ...note, zIndex: maxZ + 1, isAtBack: false };
        } else if (direction === 'back') {
          // Use minZ - 1 but ensure it stays above 6 (stars are at 5)
          const newZ = Math.max(6, minZ - 1);
          return { ...note, zIndex: newZ, isAtBack: true };
        } else if (direction === 'veryfront') {
          return { ...note, zIndex: maxZ + 1, isAtBack: false };
        }
      }
      return note;
    }));
  } else if (type === 'polaroid') {
    setPolaroids(polaroids.map(p => {
      if (p.id === id) {
        if (direction === 'front') {
          return { ...p, zIndex: maxZ + 1, isAtBack: false };
        } else if (direction === 'back') {
          // Use minZ - 1 but ensure it stays above 6 (stars are at 5)
          const newZ = Math.max(6, minZ - 1);
          return { ...p, zIndex: newZ, isAtBack: true };
        } else if (direction === 'veryfront') {
          return { ...p, zIndex: maxZ + 1, isAtBack: false };
        }
      }
      return p;
    }));
  } else if (type === 'sticker') {
    setStickers(stickers.map(s => {
      if (s.id === id) {
        if (direction === 'front') {
          return { ...s, zIndex: maxZ + 1, isAtBack: false };
        } else if (direction === 'back') {
          // Use minZ - 1 but ensure it stays above 6 (stars are at 5)
          const newZ = Math.max(6, minZ - 1);
          return { ...s, zIndex: newZ, isAtBack: true };
        } else if (direction === 'veryfront') {
          return { ...s, zIndex: maxZ + 1, isAtBack: false };
        }
      }
      return s;
    }));
  }
};

  // garland colors
  const garlandColors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#118AB2', '#EF476F', '#06D6A0', '#FF9E6D'];

   return (
  <div style={{
    width: '100%',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'url(/corkboard/corkboard.jpg)',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      <div ref={corkboardRef} style={{ width: '100%', height: '100%', position: 'relative',overflow: 'visible',}}>
        {starPositions.map((position, index) => {
  const letterNumber = index + 1;
  return (
    <Star
      key={letterNumber}
      letterNumber={letterNumber}
      position={position}
      isFullscreen={isFullscreen}
      onLetterClick={handleLetterClick}
      reaction={reactions[letterNumber]}
    />
  );
})}
        
        {/* HAMBURGER MENU - Only show when NOT fullscreen */}
        {shouldShowHamburger && (
  <div className="hamburger-menu" style={{
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 150
  }}>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{
                background: 'linear-gradient(to right, #D4A574, #C19A6B)',
                border: '2px solid #8B7355',
                borderRadius: '6px',
                padding: '5px',
                paddingLeft: '10px',
                paddingRight: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                fontSize: '20px'
              }}
            >
            {`(๑>؂•̀๑)`}
            </button>
            
            {showMobileMenu && (
              <div style={{
                position: 'absolute',
                top: '50px',
                left: '0',
                background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
                border: '3px solid #8B7355',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                minWidth: '200px',
                zIndex: 160
              }}>
                <button
                  onClick={() => { playSound('click'); setShowSaveLoad(true); setShowMobileMenu(false); }}
                  style={{
                    width: '100%',
                    background: '#2196F3',
                    color: '#fff',
                    border: '1px solid #1976D2',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px'
                  }}
                >
                  💾 Save/Load
                </button>

                <button
                  onClick={() => { handleNewProjectClick(); setShowMobileMenu(false); }}
                  style={{
                    width: '100%',
                    background: '#4CAF50',
                    color: '#fff',
                    border: '1px solid #45a049',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px'
                  }}
                >
                  ➕ New Board
                </button>

                <button
                  onClick={() => { playSound('click'); setShowGallery(true); setShowMobileMenu(false); }}
                  style={{
                    width: '100%',
                    background: '#8B2A2A',
                    color: '#fff',
                    border: '1px solid #5A1A1A',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px'
                  }}
                >
                  📷 Polaroids
                </button>

                <button
                  onClick={() => { playSound('click'); setShowStickerGallery(true); setShowMobileMenu(false); }}
                  style={{
                    width: '100%',
                    background: '#FF9800',
                    color: '#fff',
                    border: '1px solid #F57C00',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px'
                  }}
                >
                  ✨ Stickers
                </button>
                
                <button
                  onClick={() => { playSound('click'); fileInputRef.current.click(); setShowMobileMenu(false); }}
                  style={{
                    width: '100%',
                    background: '#7C8B6A',
                    color: '#fff',
                    border: '1px solid #5A6B4A',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px'
                  }}
                >
                  📤 Upload
                </button>
                
                <button
                  onClick={() => { handleAddStickyNote(); setShowMobileMenu(false); }}
                  style={{
                    width: '100%',
                    background: '#FFEB3B',
                    color: '#333',
                    border: '1px solid #FBC02D',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px'
                  }}
                >
                  📝 Sticky Note
                </button>

                <button
                  onClick={() => { handleExportClick(); setShowMobileMenu(false); }}
                  style={{
                    width: '100%',
                    background: '#9C27B0',
                    color: '#fff',
                    border: '1px solid #7B1FA2',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px'
                  }}
                >
                  📸 Export
                </button>

                <button
                  onClick={() => { setShowSettings(true); setShowMobileMenu(false); }}
                  style={{
                    width: '100%',
                    background: '#5D4037',
                    color: '#fff',
                    border: '1px solid #3E2723',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                >
                  ⚙️ Settings
                </button>
              </div>
            )}
          </div>
        )}

        {/* EDITOR TOOLBAR - Only show when IS fullscreen */}
{shouldShowToolbar && (
  <div className="toolbar" style={{
    position: 'absolute',
    top: '10px',
    left: '10px',
    right: '10px',
    background: 'linear-gradient(to right, #D4A574, #C19A6B)',
    border: '2px solid #8B7355',
    borderRadius: '6px',
    padding: '8px 12px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    zIndex: 100,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    flexWrap: 'wrap'
  }}>
            {/* toolbar content - keep all original buttons */}
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '12px', 
              fontWeight: 'bold',
              color: '#3E2B27',
              marginRight: '10px'
            }}>
              📋 {currentProjectName} {hasUnsavedChanges && '•'}
            </span>

            <button
              onClick={() => { playSound('click'); setShowSaveLoad(true); }}
              style={{
                background: '#2196F3',
                color: '#fff',
                border: '1px solid #1976D2',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            >
              💾 Save/Load
            </button>

            <button
              onClick={handleNewProjectClick}
              style={{
                background: '#4CAF50',
                color: '#fff',
                border: '1px solid #45a049',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            >
              ➕ New Board
            </button>

            <button
              onClick={() => { playSound('click'); setShowGallery(true); }}
              style={{
                background: '#8B2A2A',
                color: '#fff',
                border: '1px solid #5A1A1A',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            >
              📷 Polaroids
            </button>

            <button
              onClick={() => { playSound('click'); setShowStickerGallery(true); }}
              style={{
                background: '#FF9800',
                color: '#fff',
                border: '1px solid #F57C00',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            >
              ✨ Stickers
            </button>
            
            <button
              onClick={() => { playSound('click'); fileInputRef.current.click(); }}
              style={{
                background: '#7C8B6A',
                color: '#fff',
                border: '1px solid #5A6B4A',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            >
              🔤 Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            
            <button
              onClick={handleAddStickyNote}
              style={{
                background: '#FFEB3B',
                color: '#333',
                border: '1px solid #FBC02D',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            >
              📝 Sticky Note
            </button>

            <button
              onClick={handleExportClick}
              style={{
                background: '#9C27B0',
                color: '#fff',
                border: '1px solid #7B1FA2',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            >
              📸 Export
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  background: '#5D4037',
                  color: '#fff',
                  border: '1px solid #3E2723',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        )}
        {/* Interactive Items */}
        {stickyNotes.map((note) => (
          <InteractiveItem
            key={note.id}
            id={note.id}
            type="sticky"
            initialPosition={note.position}
            initialSize={note.size}
            initialRotation={note.rotation}
            zIndex={note.zIndex}
            isAtBack={note.isAtBack}
            onPositionChange={(position) => updateStickyNote(note.id, 'position', position)}
            onSizeChange={(size) => updateStickyNote(note.id, 'size', size)}
            onRotationChange={(rotation) => updateStickyNote(note.id, 'rotation', rotation)}
            onZIndexChange={(action) => handleZIndexChange(note.id, 'note', action)}
            onDuplicate={() => duplicateStickyNote(note.id)}
            onDelete={() => deleteStickyNote(note.id)}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src="/corkboard/boardpin.png"
                alt="pin"
                style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '20px',
                  zIndex: 25,
                  pointerEvents: 'none'
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: note.color,
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                  padding: '10px',
                  fontFamily: 'Comic Sans MS, cursive',
                  fontSize: '12px'
                }}
              >
                <textarea
                  value={note.content}
                  placeholder="write something cute here..."
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    color: '#333'
                  }}
                  onChange={(e) => updateStickyNote(note.id, 'content', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </InteractiveItem>
        ))}

        {/* Polaroids */}
        {polaroids.map((polaroid) => (
          <InteractiveItem
            key={polaroid.id}
            id={polaroid.id}
            type="polaroid"
            initialPosition={polaroid.position}
            initialSize={polaroid.size}
            initialRotation={polaroid.rotation}
            zIndex={polaroid.zIndex}
            isAtBack={polaroid.isAtBack}
            onPositionChange={(position) => updatePolaroid(polaroid.id, 'position', position)}
            onSizeChange={(size) => updatePolaroid(polaroid.id, 'size', size)}
            onRotationChange={(rotation) => updatePolaroid(polaroid.id, 'rotation', rotation)}
            onZIndexChange={(action) => handleZIndexChange(polaroid.id, 'polaroid', action)}
            onDuplicate={() => duplicatePolaroid(polaroid.id)}
            onDelete={() => deletePolaroid(polaroid.id)}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src="/corkboard/boardpin.png"
                alt="pin"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '20px',
                  zIndex: 20,
                  pointerEvents: 'none'
                }}
              />
              <img
                src={polaroid.src}
                alt="polaroid"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  pointerEvents: 'none',
                  boxShadow: '2px 2px 8px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </InteractiveItem>
        ))}

        {/* Stickers */}
        {stickers.map((sticker) => (
          <InteractiveItem
            key={sticker.id}
            id={sticker.id}
            type="sticker"
            initialPosition={sticker.position}
            initialSize={sticker.size}
            initialRotation={sticker.rotation}
            zIndex={sticker.zIndex}
            isAtBack={sticker.isAtBack}
            onPositionChange={(position) => updateSticker(sticker.id, 'position', position)}
            onSizeChange={(size) => updateSticker(sticker.id, 'size', size)}
            onRotationChange={(rotation) => updateSticker(sticker.id, 'rotation', rotation)}
            onZIndexChange={(action) => handleZIndexChange(sticker.id, 'sticker', action)}
            onDuplicate={() => duplicateSticker(sticker.id)}
            onDelete={() => deleteSticker(sticker.id)}
          >
            <img
              src={sticker.src}
              alt="sticker"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
                pointerEvents: 'none'
              }}
            />
          </InteractiveItem>
        ))}
      </div>

      {/* Hidden file input for mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Gallery Popup */}
      {showGallery && (
        <GalleryPopup
          onClose={() => setShowGallery(false)}
          onAddPolaroid={handleAddPolaroid}
        />
      )}

      {/* Sticker Gallery Popup */}
      {showStickerGallery && (
        <StickerGalleryPopup
          onClose={() => setShowStickerGallery(false)}
          onAddSticker={handleAddSticker}
        />
      )}

      {/* Letter Popup */}
      {selectedLetter && (
        <LetterPopup
          letterNumber={selectedLetter}
          onClose={handleCloseLetter}
          onReaction={handleReaction}
        />
      )}

      {/* Settings Popup */}
      {showSettings && (
        <SettingsPopup
          onClose={() => setShowSettings(false)}
          volume={volume}
          setVolume={setVolume}
          isPlaying={isPlaying}
          toggleMusic={toggleMusic}
        />
      )}

      {/* Save/Load Popup - UPDATED */}
      {showSaveLoad && (
  <SaveLoadPopup
    onClose={() => setShowSaveLoad(false)}
    onSave={handleSaveProject}
    onLoad={handleLoadProject}
    onSaveChanges={handleSaveProject}
    savedProjects={savedProjectsCache.length > 0 ? savedProjectsCache : getSavedProjects()}
    currentHasUnsavedChanges={hasUnsavedChanges}
    currentProjectName={currentProjectName}
  />
)}

      {/* Export Confirmation Popup */}
      {showExportConfirm && (
        <ConfirmationPopup
          title="export corkboard? ♡"
          message="wanna save ur beautiful corkboard as an image? ♡"
          onConfirm={handleExportConfirm}
          onCancel={() => setShowExportConfirm(false)}
          confirmText="yes pls! ♡"
          cancelText="nope!"
          confirmColor="#9C27B0"
        />
      )}

      {/* Export Success Popup */}
      {showExportSuccess && (
        <ExportSuccessPopup
          onClose={() => {
            setShowExportSuccess(false);
            setExportedImageBlob(null);
            setExportedImageFilename('');
          }}
          onShare={handleShareFromPopup}
          hasShareAPI={navigator.share && navigator.canShare}
        />
      )}

      {/* New Project Popup */}
      {showNewProjectPopup && (
        <NewProjectPopup
          onConfirm={handleCreateNewProject}
          onCancel={() => setShowNewProjectPopup(false)}
        />
      )}

      {/* Unsaved Warning Popup */}
      {showUnsavedWarning && (
        <ConfirmationPopup
          title="unsaved changes! ♡"
          message="u have unsaved work! save it first? ♡"
          onConfirm={() => {
            setShowUnsavedWarning(false);
            setShowSaveLoad(true);
          }}
          onCancel={() => {
            setShowUnsavedWarning(false);
            setShowNewProjectPopup(true);
          }}
          confirmText="save first! ♡"
          cancelText="nah, continue"
          confirmColor="#2196F3"
        />
      )}

      {/* Load Confirmation Popup */}
      {showLoadConfirm && (
        <ConfirmationPopup
          title={`open "${loadProjectName}"? ♡`}
          message="loading this will replace ur current work! ♡"
          onConfirm={() => loadProjectDirectly(loadProjectName)}
          onCancel={() => {
            setShowLoadConfirm(false);
            setLoadProjectName('');
          }}
          confirmText="yes! open it ♡"
          cancelText="no wait!"
          confirmColor="#4CAF50"
        />
      )}

      {/* Delete Project Confirmation Popup */}
      {showDeleteConfirm && (
        <ConfirmationPopup
          title="delete project? ♡"
          message={`really delete "${deleteProjectName}"? cant undo this! ♡`}
          onConfirm={handleDeleteProjectConfirm}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteProjectName('');
          }}
          confirmText="yes, delete! ♡"
          cancelText="no keep it!"
          confirmColor="#f44336"
        />
      )}

      {/* Success Message Popup */}
      {showSuccessMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => {
            setShowSuccessMessage(false);
            setSuccessMessage('');
          }}
        />
      )}
    </div>
  );
}

export default CorkboardApp;