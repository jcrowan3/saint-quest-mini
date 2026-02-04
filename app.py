import streamlit as st
import json
import time

st.set_page_config(page_title="Saint Quest — Mini MVP", layout="wide")

# --- LOAD CSS ---
def local_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

local_css("style.css")

# --- DATA ---
@st.cache_data
def load_data():
    with open("data/saints.json", "r") as f:
        saints = json.load(f)
    with open("data/quests.json", "r") as f:
        quests = json.load(f)
    return saints, quests

saints, quests = load_data()

# --- STATE ---
if "selected_saint" not in st.session_state:
    st.session_state.selected_saint = None
if "checkpoint_idx" not in st.session_state:
    st.session_state.checkpoint_idx = 0
if "virtues" not in st.session_state:
    st.session_state.virtues = {"Faith": 0, "Mercy": 0, "Courage": 0, "Wisdom": 0}
if "game_state" not in st.session_state:
    st.session_state.game_state = "SELECT"

# --- THEME INJECTION ---
# Inject dynamic CSS based on saint
bg_color = "#ffffff"
if st.session_state.selected_saint == "francis":
    bg_color = "#f4f9f4" # Subtle Green
elif st.session_state.selected_saint == "carlo":
    bg_color = "#f0f8ff" # Subtle Blue

st.markdown(f"""
<style>
[data-testid="stAppViewContainer"] {{
    background-color: {bg_color};
}}
</style>
""", unsafe_allow_html=True)

# --- HEADER ---
st.markdown("<h1 style='text-align: center;'>⚔️ Saint Quest 🛡️</h1>", unsafe_allow_html=True)

if st.session_state.game_state == "SELECT":
    st.markdown("<h3 style='text-align: center;'>Choose Your Hero</h3>", unsafe_allow_html=True)
    st.write("")
    
    cols = st.columns(len(saints))
    for i, s in enumerate(saints):
        with cols[i]:
            st.markdown(f"""
            <div class='story-card' style='text-align: center;'>
                <div style='font-size: 60px;'>{s['avatar']}</div>
                <h3>{s['name']}</h3>
                <p><i>Virtues: {', '.join(s['virtues'])}</i></p>
            </div>
            """, unsafe_allow_html=True)
            
            if st.button(f"Begin Journey", key=f"btn_{s['id']}"):
                st.session_state.selected_saint = s["id"]
                st.session_state.checkpoint_idx = 0
                st.session_state.virtues = {"Faith": 0, "Mercy": 0, "Courage": 0, "Wisdom": 0}
                st.session_state.game_state = "PLAY"
                st.rerun()

elif st.session_state.game_state == "PLAY":
    saint_id = st.session_state.selected_saint
    saint = next(s for s in saints if s["id"] == saint_id)
    quest_list = quests[saint_id]
    current_idx = st.session_state.checkpoint_idx
    
    # Progress
    progress = (current_idx / len(quest_list))
    st.progress(progress)
    st.caption(f"Chapter {current_idx + 1} of {len(quest_list)}")

    q = quest_list[current_idx]
    
    c1, c2 = st.columns([2, 1])
    
    with c1:
        # Story Card
        st.markdown(f"""
        <div class='story-card'>
            <h2>{q['title']}</h2>
            <p style='font-size: 1.2em; line-height: 1.6;'>{q['story']}</p>
        </div>
        """, unsafe_allow_html=True)

        ch = q['challenge']
        
        # Challenge Logic
        if ch['type'] == 'trivia':
            st.markdown("#### 📜 Knowledge Check")
            st.info(ch['question'])
            choice = st.radio("Your Answer:", ch['choices'], label_visibility="collapsed")
            if st.button("Submit Answer"):
                if ch['choices'].index(choice) == ch['answer_index']:
                    st.toast("Correct! +Virtue")
                    time.sleep(0.5)
                    st.balloons()
                    for k,v in q['reward'].items():
                        st.session_state.virtues[k] += v
                else:
                    st.error("Not quite — try next challenge.")
                st.session_state.checkpoint_idx += 1
                if st.session_state.checkpoint_idx >= len(quest_list):
                    st.session_state.game_state = "DONE"
                st.rerun()

        elif ch['type'] == 'dilemma':
            st.markdown("#### ⚖️ What will you do?")
            st.info(ch['prompt'])
            choice = st.radio("Your Choice:", ch['options'], label_visibility="collapsed")
            if st.button("Make Choice"):
                if ch['options'].index(choice) == ch['answer_index']:
                    st.success("A virtuous path!")
                    st.balloons()
                    for k,v in q['reward'].items():
                        st.session_state.virtues[k] += v
                else:
                    st.warning("A difficult path... reflect on this.")
                st.session_state.checkpoint_idx += 1
                if st.session_state.checkpoint_idx >= len(quest_list):
                    st.session_state.game_state = "DONE"
                st.rerun()

    with c2:
        # Profile Sidebar
        st.markdown(f"""
        <div style='background-color: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>
            <div style='font-size: 50px;'>{saint['avatar']}</div>
            <b>{saint['name']}</b>
            <hr style='margin: 15px 0;'>
            <div style='text-align: left;'>
        """, unsafe_allow_html=True)
        
        for k, v in st.session_state.virtues.items():
            if v > 0:
                color_class = f"v-{k.lower()}"
                st.markdown(f"<span class='virtue-badge {color_class}'>{k}: {v}</span>", unsafe_allow_html=True)
        
        st.markdown("</div></div>", unsafe_allow_html=True)

elif st.session_state.game_state == "DONE":
    saint = next(s for s in saints if s["id"] == st.session_state.selected_saint)
    
    st.markdown(f"""
    <div class='story-card' style='text-align: center; border-color: gold; background-color: #fffef0;'>
        <h1>Sainthood Unlocked!</h1>
        <div style='font-size: 80px;'>😇</div>
        <p style='font-size: 1.3em;'>You have completed the journey of <b>{saint['name']}</b>.</p>
        <p><i>"Start by doing what's necessary; then do what's possible; and suddenly you are doing the impossible."</i></p>
    </div>
    """, unsafe_allow_html=True)
    
    st.balloons()
    
    st.subheader("Final Virtue Profile")
    st.json(st.session_state.virtues)

    if st.button("Start New Journey"):
        st.session_state.game_state = "SELECT"
        st.rerun()
