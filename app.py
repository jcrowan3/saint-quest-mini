import streamlit as st
import json
import time
from typing import Dict, List, Any

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
    
    cols = st.columns(len(saints))
    for i, s in enumerate(saints):
        with cols[i]:
            st.markdown(f"""
            <div class='story-card' style='text-align: center;'>
                <div style='font-size: 60px;'>{s.get('avatar', '❓')}</div>
                <h3>{s.get('name', 'Unknown Saint')}</h3>
                <p><i>Virtues: {', '.join(s.get('virtues', []))}</i></p>
            </div>
            """, unsafe_allow_html=True)
            
            if st.button(f"Begin Journey", key=f"btn_{s.get('id', i)}", use_container_width=True):
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

def render_game_done(saint: Dict):
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

    if st.button("Start New Journey", use_container_width=True):
        st.session_state.game_state = "SELECT"
        st.rerun()

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

# --- MAIN APP ---
def main():
    st.set_page_config(page_title="Saint Quest — Mini MVP", layout="wide")
    
    # Load CSS
    local_css("style.css")
    
    # Load data
    saints, quests = load_data()
    
    # Initialize session state
    if "game_state" not in st.session_state:
        st.session_state.game_state = "SELECT"
    
    # Route to appropriate screen
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
                render_game_done(saint)
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
# Virtue tracking functions
def get_virtue_progress():
    """Get earned virtue points from localStorage"""
    if 'virtue_progress' not in st.session_state:
        # Initialize with zero points for all virtues
        st.session_state.virtue_progress = {}
        # Get all possible virtues from saints data
        saints = load_saints()
        all_virtues = set()
        for saint in saints:
            for virtue in saint['virtues']:
                all_virtues.add(virtue)
        for virtue in all_virtues:
            st.session_state.virtue_progress[virtue] = 0
    return st.session_state.virtue_progress

def add_quest_completion(saint_id, quest_title):
    """Mark a quest as completed and award virtue points"""
    if 'completed_quests' not in st.session_state:
        st.session_state.completed_quests = set()
    
    quest_key = f"{saint_id}:{quest_title}"
    if quest_key in st.session_state.completed_quests:
        return False  # Already completed
    
    # Add to completed set
    st.session_state.completed_quests.add(quest_key)
    
    # Award virtue points
    quests = load_quests()
    if saint_id in quests:
        for quest in quests[saint_id]:
            if quest['title'] == quest_title:
                reward = quest.get('reward', {})
                virtue_progress = get_virtue_progress()
                for virtue, points in reward.items():
                    virtue_progress[virtue] = virtue_progress.get(virtue, 0) + points
                break
    
    return True

def get_total_possible_points():
    """Calculate total possible points per virtue from all quests"""
    saints = load_saints()
    quests = load_quests()
    
    # Get all virtues
    all_virtues = set()
    for saint in saints:
        for virtue in saint['virtues']:
            all_virtues.add(virtue)
    
    # Calculate totals
    totals = {virtue: 0 for virtue in all_virtues}
    for saint_id, saint_quests in quests.items():
        for quest in saint_quests:
            reward = quest.get('reward', {})
            for virtue, points in reward.items():
                if virtue in totals:
                    totals[virtue] += points
    return totals

def show_virtue_dashboard():
    """Display the virtue progress dashboard"""
    st.subheader("🌟 Virtue Progress")
    
    virtue_progress = get_virtue_progress()
    total_points = get_total_possible_points()
    
    if not virtue_progress:
        st.info("Start completing quests to earn virtue points!")
        return
    
    # Create columns for progress bars
    cols = st.columns(2)
    col_index = 0
    
    for virtue in sorted(virtue_progress.keys()):
        earned = virtue_progress.get(virtue, 0)
        total = total_points.get(virtue, 0)
        percentage = min(100, int((earned / total * 100) if total > 0 else 0))
        
        # Determine color based on progress
        if percentage >= 66:
            color = "green"
        elif percentage >= 33:
            color = "yellow"
        else:
            color = "red"
        
        with cols[col_index]:
            st.markdown(f"**{virtue.title()}**")
            st.progress(percentage / 100.0)
            st.caption(f"{earned}/{total} points ({percentage}%)")
            
        col_index = (col_index + 1) % 2

