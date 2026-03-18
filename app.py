import streamlit as st
import json
import time
import folium
from streamlit_folium import st_folium

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
if "completed_saints" not in st.session_state:
    st.session_state.completed_saints = []

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

# Navigation sidebar
page = st.sidebar.radio("Navigation", ["Saint Quest", "Saint Map", "Liturgical Calendar"])

if page == "Saint Quest":
    # --- MAIN GAME LOGIC ---
    if st.session_state.game_state == "SELECT":
        st.markdown("<h3 style='text-align: center;'>Choose Your Hero</h3>", unsafe_allow_html=True)
        st.write("")
        
        cols = st.columns(len(saints))
        for i, s in enumerate(saints):
            with cols[i]:
                st.markdown(f"""
                <div class='story-card hero-card' style='text-align: center;'>
                    <div style='font-size: 80px;'>{s['avatar']}</div>
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
                    with st.spinner("Checking your answer..."):
                        time.sleep(1)  # Add a small delay to show spinner
                    if ch['choices'].index(choice) == ch['answer_index']:
                        st.success("Correct! +Virtue", icon="✅")
                        # Reward virtues once (avoid double-counting)
                        for k, v in q['reward'].items():
                            st.session_state.virtues[k] += v
                        # Visual feedback
                        st.markdown("<div class='balloon-animation'>", unsafe_allow_html=True)
                        st.balloons()
                        st.markdown("</div>", unsafe_allow_html=True)
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
                    with st.spinner("Reflecting on your choice..."):
                        time.sleep(1)  # Add a small delay to show spinner
                    if ch['options'].index(choice) == ch['answer_index']:
                        st.success("A virtuous path!", icon="✨")
                        # Reward virtues once (avoid double-counting)
                        for k, v in q['reward'].items():
                            st.session_state.virtues[k] += v
                        # Visual feedback
                        st.markdown("<div class='balloon-animation'>", unsafe_allow_html=True)
                        st.balloons()
                        st.markdown("</div>", unsafe_allow_html=True)
                    else:
                        st.warning("A difficult path... reflect on this.")
                    st.session_state.checkpoint_idx += 1
                    if st.session_state.checkpoint_idx >= len(quest_list):
                        st.session_state.game_state = "DONE"
                    st.rerun()

        with c2:
            # Profile Sidebar
            st.markdown(f"""
            <div style='background-color: white; padding: 20px; border-radius: 16px; border: 1px solid #eee; text-align: center; box-shadow: 0 8px 16px rgba(0,0,0,0.05);'>
                <div style='font-size: 60px;'>{saint['avatar']}</div>
                <b>{saint['name']}</b>
                <hr style='margin: 15px 0;'>
                <div style='text-align: left;'>
            """, unsafe_allow_html=True)
            
            for k, v in st.session_state.virtues.items():
                color_class = f"v-{k.lower()}"
                zero_class = " is-zero" if v == 0 else ""
                st.markdown(
                    f"<span class='virtue-badge {color_class}{zero_class}'>{k}: {v}</span>",
                    unsafe_allow_html=True,
                )
            
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

        # Add collection badge section
        st.subheader("Saint Collection")
        st.markdown("<p>These saints have been completed:</p>", unsafe_allow_html=True)
        
        if st.session_state.selected_saint not in st.session_state.completed_saints:
            st.session_state.completed_saints.append(st.session_state.selected_saint)
        
        # Display collection badges
        cols = st.columns(len(saints))
        for i, s in enumerate(saints):
            with cols[i]:
                if s["id"] in st.session_state.completed_saints:
                    st.markdown(f"""
                    <div class='story-card hero-card' style='text-align: center; background-color: #e8f5e9; border: 2px solid #2ecc71;'>
                        <div style='font-size: 60px;'>{s['avatar']}</div>
                        <h3>{s['name']}</h3>
                        <p><i>✅ Completed</i></p>
                    </div>
                    """, unsafe_allow_html=True)
                else:
                    st.markdown(f"""
                    <div class='story-card hero-card' style='text-align: center; background-color: #f8f9fa; border: 2px solid #ccc;'>
                        <div style='font-size: 60px;'>{s['avatar']}</div>
                        <h3>{s['name']}</h3>
                        <p><i>🔒 Locked</i></p>
                    </div>
                    """, unsafe_allow_html=True)

        if st.button("Start New Journey"):
            st.session_state.game_state = "SELECT"
            st.rerun()
        
elif page == "Saint Map":
    # --- MAP VIEW ---
    st.markdown("<h2 style='text-align: center;'>Saint Geographic Map</h2>", unsafe_allow_html=True)
    
    # Sample saint locations (in a real implementation, this would come from data)
    saint_locations = {
        "francis": {"name": "St. Francis of Assisi", "lat": 43.0752, "lon": 12.6384, "desc": "Born in Assisi, Italy"},
        "carlo": {"name": "St. Carlo Acutis", "lat": 41.9029, "lon": 12.4964, "desc": "Born in Milan, Italy"}
    }
    
    # Create a map centered on Italy
    m = folium.Map(location=[41.9029, 12.4964], zoom_start=5)
    
    # Add markers for each saint
    for saint_id, location_data in saint_locations.items():
        folium.Marker(
            location=[location_data["lat"], location_data["lon"]],
            popup=f"<b>{location_data['name']}</b><br>{location_data['desc']}",
            tooltip=location_data["name"]
        ).add_to(m)
        
        # Add a circle to highlight important locations
        folium.Circle(
            location=[location_data["lat"], location_data["lon"]],
            radius=10000,  # in meters
            color='red',
            fill=True,
            fill_color='red',
            fill_opacity=0.1
        ).add_to(m)
    
    # Display the map
    st_folium(m, width=800, height=500)

else:  # Liturgical Calendar view
    # --- LITURGICAL CALENDAR ---
    st.markdown("<h2 style='text-align: center;'>Liturgical Calendar</h2>", unsafe_allow_html=True)
    
    st.markdown("""
    <p>This section shows feast days for saints in the Catholic liturgical calendar.</p>
    """, unsafe_allow_html=True)
    
    # Simple data for feast days
    feast_days = {
        "francis": {"name": "St. Francis of Assisi", "date": "October 4"},
        "carlo": {"name": "St. Carlo Acutis", "date": "October 11"}
    }
    
    # Display the feast days in a nice tabular format
    st.subheader("Feast Days")
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("<h4>Major Feast Days</h4>", unsafe_allow_html=True)
        for saint_id, data in feast_days.items():
            if saint_id in st.session_state.completed_saints:
                st.markdown(f"""
                <div class='story-card' style='background-color: #e8f5e9; border-left: 4px solid #2ecc71;'>
                    <h3>{data['name']}</h3>
                    <p>Date: {data['date']}</p>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div class='story-card' style='background-color: #f8f9fa; border-left: 4px solid #ccc;'>
                    <h3>{data['name']}</h3>
                    <p>Date: {data['date']}</p>
                </div>
                """, unsafe_allow_html=True)
                
    with col2:
        st.markdown("<h4>Completion Progress</h4>", unsafe_allow_html=True)
        total_saints = len(saints)
        completed = len(st.session_state.completed_saints)
        if total_saints > 0:
            completion_percentage = (completed / total_saints) * 100
            st.progress(completion_percentage)
            st.markdown(f"<p>Completed: {completed}/{total_saints} saints</p>", unsafe_allow_html=True)
        
        st.markdown("<h4>Tip:</h4>", unsafe_allow_html=True)
        st.markdown("""
        <p>The liturgical calendar celebrates saints throughout the year. 
        In this game, you can track which saints you've completed and when their feast days occur!</p>
        """, unsafe_allow_html=True)

