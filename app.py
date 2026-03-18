import streamlit as st
import json
import time
from typing import Dict, List, Any
import folium
from streamlit_folium import st_folium

# --- CONSTANTS ---
VIRTUES = ["Faith", "Mercy", "Courage", "Wisdom"]
DEFAULT_SAINTS_FILE = "data/saints.json"
DEFAULT_QUESTS_FILE = "data/quests.json"

# --- DATA LOADING WITH ERROR HANDLING ---
def load_json_file(filepath: str, default: Any = None) -> Any:
    """Load JSON file with error handling."""
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        st.error(f"Data file not found: {filepath}")
        st.stop()
    except json.JSONDecodeError as e:
        st.error(f"Invalid JSON in {filepath}: {e}")
        st.stop()
    except Exception as e:
        st.error(f"Error loading {filepath}: {e}")
        st.stop()

@st.cache_data
def load_data() -> tuple:
    """Load saints and quests data."""
    saints = load_json_file(DEFAULT_SAINTS_FILE, [])
    quests = load_json_file(DEFAULT_QUESTS_FILE, {})

    # Basic validation
    if not isinstance(saints, list):
        st.error("Saints data should be a list")
        st.stop()

    if not isinstance(quests, dict):
        st.error("Quests data should be a dictionary")
        st.stop()

    return saints, quests

# --- CSS ---
def local_css(file_name: str):
    """Load local CSS file."""
    try:
        with open(file_name) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
    except FileNotFoundError:
        st.warning(f"CSS file not found: {file_name}")

# --- UI COMPONENTS ---
def render_saint_selection(saints: List[Dict]):
    """Render saint selection screen."""
    # Show daily reflection
    from datetime import date
    today = date.today().strftime('%m-%d')
    reflections = load_json_file("data/reflections.json", {})
    if today in reflections:
        reflection = reflections[today]
        st.markdown(f"""
        <div style='background-color: #f0f8ff; padding: 15px; border-radius: 10px; border-left: 4px solid #4CAF50; margin-bottom: 20px;'>
            <h4 style='color: #2E7D32; margin-top: 0;'>Daily Reflection ({today})</h4>
            <p><strong>Saint:</strong> {reflection.get('saint', 'Unknown').title().replace('_', ' ')}</p>
            <p style='font-style: italic;'>{reflection.get('reflection', 'No reflection available.')}</p>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.info(f"No daily reflection available for {today}")

    st.markdown("<h3 style='text-align: center;'>Choose Your Hero</h3>", unsafe_allow_html=True)
    st.write("")

    # Create responsive grid - max 3 columns per row
    cols_per_row = 3
    for i in range(0, len(saints), cols_per_row):
        cols = st.columns(cols_per_row)
        for j, s in enumerate(saints[i:i+cols_per_row]):
            with cols[j]:
                st.markdown(f"""
                <div class='story-card' style='text-align: center;'>
                    <div style='font-size: 60px;'>{s.get('avatar', '❓')}</div>
                    <h3>{s.get('name', 'Unknown Saint')}</h3>
                    <p><i>Virtues: {', '.join(s.get('virtues', []))}</i></p>
                </div>
                """, unsafe_allow_html=True)

                if st.button(f"Begin Journey", key=f"btn_{s.get('id', i+j)}", use_container_width=True):
                    initialize_game_state(s)
                    st.rerun()

def render_game_play(saint: Dict, quest_list: List[Dict]):
    """Render gameplay screen."""
    saint_id = st.session_state.selected_saint
    current_idx = st.session_state.checkpoint_idx

    # Progress
    progress = (current_idx / len(quest_list)) if quest_list else 0
    st.progress(progress)
    st.caption(f"Chapter {current_idx + 1} of {len(quest_list)}")

    if current_idx >= len(quest_list):
        st.session_state.game_state = "DONE"
        st.rerun()
        return

    q = quest_list[current_idx]

    # Responsive layout: stacked on mobile, side-by-side on desktop
    if st.session_state.get('mobile_view', False):
        # Mobile: stack vertically
        with st.container():
            # Story Card
            st.markdown(f"""
            <div class='story-card'>
                <h2>{q.get('title', 'Unknown Quest')}</h2>
                <p style='font-size: 1.2em; line-height: 1.6;'>{q.get('story', '')}</p>
            </div>
            """, unsafe_allow_html=True)

            ch = q.get('challenge', {})

            # Challenge Logic
            if ch.get('type') == 'trivia':
                render_trivia_challenge(ch, q)
            elif ch.get('type') == 'dilemma':
                render_dilemma_challenge(ch, q)
            else:
                st.warning("Unknown challenge type")

        st.markdown("<br>", unsafe_allow_html=True)  # Add spacing

        with st.container():
            render_profile_sidebar(saint)
            show_virtue_dashboard()
    else:
        # Desktop: side-by-side
        c1, c2 = st.columns([2, 1])

        with c1:
            # Story Card
            st.markdown(f"""
            <div class='story-card'>
                <h2>{q.get('title', 'Unknown Quest')}</h2>
                <p style='font-size: 1.2em; line-height: 1.6;'>{q.get('story', '')}</p>
            </div>
            """, unsafe_allow_html=True)

            ch = q.get('challenge', {})

            # Challenge Logic
            if ch.get('type') == 'trivia':
                render_trivia_challenge(ch, q)
            elif ch.get('type') == 'dilemma':
                render_dilemma_challenge(ch, q)
            else:
                st.warning("Unknown challenge type")

        with c2:
            render_profile_sidebar(saint)
            show_virtue_dashboard()

def render_trivia_challenge(ch: Dict, q: Dict):
    """Render trivia challenge."""
    st.markdown("#### 📜 Knowledge Check")
    st.info(ch.get('question', 'Question not available'))

    choices = ch.get('choices', [])
    if not choices:
        st.error("No choices available for trivia")
        return

    choice = st.radio("Your Answer:", choices, label_visibility="collapsed")

    if st.button("Submit Answer", use_container_width=True):
        answer_index = ch.get('answer_index', 0)
        if 0 <= answer_index < len(choices):
            if choices.index(choice) == answer_index:
                handle_correct_answer(q)
            else:
                handle_incorrect_answer()
        else:
            st.error("Invalid answer index in challenge data")

def render_dilemma_challenge(ch: Dict, q: Dict):
    """Render dilemma challenge."""
    st.markdown("#### ⚖️ What will you do?")
    st.info(ch.get('prompt', 'Prompt not available'))

    options = ch.get('options', [])
    if not options:
        st.error("No options available for dilemma")
        return

    choice = st.radio("Your Choice:", options, label_visibility="collapsed")

    if st.button("Make Choice", use_container_width=True):
        answer_index = ch.get('answer_index', 0)
        if 0 <= answer_index < len(options):
            if options.index(choice) == answer_index:
                handle_correct_answer(q)
            else:
                handle_incorrect_answer()
        else:
            st.error("Invalid answer index in challenge data")

def render_profile_sidebar(saint: Dict):
    """Render player profile sidebar."""
    st.markdown(f"""
    <div style='background-color: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>
        <div style='font-size: 50px;'>{saint.get('avatar', '❓')}</div>
        <b>{saint.get('name', 'Unknown Saint')}</b>
        <hr style='margin: 15px 0;'>
        <div style='text-align: left;'>
    """, unsafe_allow_html=True)

    for k, v in st.session_state.virtues.items():
        if v > 0:
            color_class = f"v-{k.lower()}"
            st.markdown(f"<span class='virtue-badge {color_class}'>{k}: {v}</span>", unsafe_allow_html=True)

    st.markdown("</div></div>", unsafe_allow_html=True)

def render_game_done(saint: Dict, saints: List[Dict]):
    """Render game completion screen."""
    st.markdown(f"""
    <div class='story-card' style='text-align: center; border-color: gold; background-color: #fffef0;'>
        <h1>Sainthood Unlocked!</h1>
        <div style='font-size: 80px;'>😇</div>
        <p style='font-size: 1.3em;'>You have completed the journey of <b>{saint.get('name', 'Unknown Saint')}</b>.</p>
        <p><i>"Start by doing what's necessary; then do what's possible; and suddenly you are doing the impossible."</i></p>
    </div>
    """, unsafe_allow_html=True)

    st.balloons()

    st.subheader("Final Virtue Profile")
    st.json(st.session_state.virtues)

    # Collection badges
    st.subheader("Saint Collection")
    st.markdown("<p>These saints have been completed:</p>", unsafe_allow_html=True)

    if st.session_state.selected_saint not in st.session_state.completed_saints:
        st.session_state.completed_saints.append(st.session_state.selected_saint)

    cols = st.columns(min(len(saints), 3))
    for i, s in enumerate(saints):
        with cols[i % min(len(saints), 3)]:
            if s.get("id") in st.session_state.completed_saints:
                st.markdown(f"""
                <div class='story-card' style='text-align: center; background-color: #e8f5e9; border: 2px solid #2ecc71;'>
                    <div style='font-size: 60px;'>{s.get('avatar', '❓')}</div>
                    <h3>{s.get('name', 'Unknown')}</h3>
                    <p><i>Completed</i></p>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div class='story-card' style='text-align: center; background-color: #f8f9fa; border: 2px solid #ccc;'>
                    <div style='font-size: 60px;'>{s.get('avatar', '❓')}</div>
                    <h3>{s.get('name', 'Unknown')}</h3>
                    <p><i>Locked</i></p>
                </div>
                """, unsafe_allow_html=True)

    if st.button("Start New Journey", use_container_width=True):
        st.session_state.game_state = "SELECT"
        st.rerun()

def render_saint_map():
    """Render the geographic map of saint locations."""
    st.markdown("<h2 style='text-align: center;'>Saint Geographic Map</h2>", unsafe_allow_html=True)

    saint_locations = {
        "francis": {"name": "St. Francis of Assisi", "lat": 43.0752, "lon": 12.6384, "desc": "Born in Assisi, Italy"},
        "carlo": {"name": "St. Carlo Acutis", "lat": 41.9029, "lon": 12.4964, "desc": "Born in Milan, Italy"}
    }

    m = folium.Map(location=[41.9029, 12.4964], zoom_start=5)

    for saint_id, loc in saint_locations.items():
        folium.Marker(
            location=[loc["lat"], loc["lon"]],
            popup=f"<b>{loc['name']}</b><br>{loc['desc']}",
            tooltip=loc["name"]
        ).add_to(m)

        folium.Circle(
            location=[loc["lat"], loc["lon"]],
            radius=10000,
            color='red',
            fill=True,
            fill_color='red',
            fill_opacity=0.1
        ).add_to(m)

    st_folium(m, width=800, height=500)

def render_liturgical_calendar(saints: List[Dict]):
    """Render the liturgical calendar page."""
    st.markdown("<h2 style='text-align: center;'>Liturgical Calendar</h2>", unsafe_allow_html=True)

    st.markdown("""
    <p>This section shows feast days for saints in the Catholic liturgical calendar.</p>
    """, unsafe_allow_html=True)

    feast_days = {
        "francis": {"name": "St. Francis of Assisi", "date": "October 4"},
        "carlo": {"name": "St. Carlo Acutis", "date": "October 11"}
    }

    st.subheader("Feast Days")
    col1, col2 = st.columns(2)

    with col1:
        st.markdown("<h4>Major Feast Days</h4>", unsafe_allow_html=True)
        for saint_id, data in feast_days.items():
            if saint_id in st.session_state.get('completed_saints', []):
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
        completed = len(st.session_state.get('completed_saints', []))
        if total_saints > 0:
            completion_percentage = (completed / total_saints) * 100
            st.progress(completion_percentage / 100.0)
            st.markdown(f"<p>Completed: {completed}/{total_saints} saints</p>", unsafe_allow_html=True)

        st.markdown("<h4>Tip:</h4>", unsafe_allow_html=True)
        st.markdown("""
        <p>The liturgical calendar celebrates saints throughout the year.
        In this game, you can track which saints you've completed and when their feast days occur!</p>
        """, unsafe_allow_html=True)

# --- GAME LOGIC ---
def initialize_game_state(saint: Dict):
    """Initialize game state for a new game."""
    st.session_state.selected_saint = saint["id"]
    st.session_state.checkpoint_idx = 0
    st.session_state.virtues = {virtue: 0 for virtue in VIRTUES}
    st.session_state.game_state = "PLAY"

def handle_correct_answer(q: Dict):
    """Handle correct answer."""
    st.toast("Correct! +Virtue")
    time.sleep(0.5)
    st.balloons()
    reward = q.get('reward', {})
    for k, v in reward.items():
        if k in st.session_state.virtues:
            st.session_state.virtues[k] += v
    st.session_state.checkpoint_idx += 1

def handle_incorrect_answer():
    """Handle incorrect answer."""
    st.error("Not quite — try next challenge.")
    st.session_state.checkpoint_idx += 1

# --- VIRTUE TRACKING ---
def get_virtue_progress():
    """Get earned virtue points."""
    if 'virtue_progress' not in st.session_state:
        st.session_state.virtue_progress = {}
        saints, _ = load_data()
        all_virtues = set()
        for saint in saints:
            for virtue in saint.get('virtues', []):
                all_virtues.add(virtue)
        for virtue in all_virtues:
            st.session_state.virtue_progress[virtue] = 0
    return st.session_state.virtue_progress

def get_total_possible_points():
    """Calculate total possible points per virtue from all quests."""
    saints, quests = load_data()

    all_virtues = set()
    for saint in saints:
        for virtue in saint.get('virtues', []):
            all_virtues.add(virtue)

    totals = {virtue: 0 for virtue in all_virtues}
    for saint_id, saint_quests in quests.items():
        for quest in saint_quests:
            reward = quest.get('reward', {})
            for virtue, points in reward.items():
                if virtue in totals:
                    totals[virtue] += points
    return totals

def show_virtue_dashboard():
    """Display the virtue progress dashboard."""
    st.subheader("Virtue Progress")

    virtue_progress = get_virtue_progress()
    total_points = get_total_possible_points()

    if not virtue_progress:
        st.info("Start completing quests to earn virtue points!")
        return

    cols = st.columns(2)
    col_index = 0

    for virtue in sorted(virtue_progress.keys()):
        earned = virtue_progress.get(virtue, 0)
        total = total_points.get(virtue, 0)
        percentage = min(100, int((earned / total * 100) if total > 0 else 0))

        with cols[col_index]:
            st.markdown(f"**{virtue.title()}**")
            st.progress(percentage / 100.0)
            st.caption(f"{earned}/{total} points ({percentage}%)")

        col_index = (col_index + 1) % 2

# --- MAIN APP ---
def main():
    st.set_page_config(
        page_title="Saint Quest — Mini MVP",
        layout="centered",
        initial_sidebar_state="auto"
    )

    # Load CSS
    local_css("style.css")

    # Load data
    saints, quests = load_data()

    # Initialize session state
    if "game_state" not in st.session_state:
        st.session_state.game_state = "SELECT"
    if "completed_saints" not in st.session_state:
        st.session_state.completed_saints = []

    # Navigation sidebar
    page = st.sidebar.radio("Navigation", ["Saint Quest", "Saint Map", "Liturgical Calendar"])

    if page == "Saint Map":
        render_saint_map()
    elif page == "Liturgical Calendar":
        render_liturgical_calendar(saints)
    else:
        # Route to appropriate game screen
        if st.session_state.game_state == "SELECT":
            render_saint_selection(saints)
        elif st.session_state.game_state == "PLAY":
            if st.session_state.selected_saint:
                saint = next((s for s in saints if s["id"] == st.session_state.selected_saint), None)
                if saint:
                    quest_list = quests.get(saint["id"], [])
                    render_game_play(saint, quest_list)
                else:
                    st.error("Selected saint not found")
                    st.session_state.game_state = "SELECT"
                    st.rerun()
            else:
                st.error("No saint selected")
                st.session_state.game_state = "SELECT"
                st.rerun()
        elif st.session_state.game_state == "DONE":
            if st.session_state.selected_saint:
                saint = next((s for s in saints if s["id"] == st.session_state.selected_saint), None)
                if saint:
                    render_game_done(saint, saints)
                else:
                    st.error("Selected saint not found")
                    st.session_state.game_state = "SELECT"
                    st.rerun()
            else:
                st.error("No saint selected")
                st.session_state.game_state = "SELECT"
                st.rerun()

if __name__ == "__main__":
    main()
