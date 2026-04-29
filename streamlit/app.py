import streamlit as st
import json
import sys
import subprocess
import os
from get_stats import get_stats
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Page config
st.set_page_config(
    page_title="ReviewGuard - Fake Review Detector",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🛡️ ReviewGuard")
st.markdown("**AI-Powered Fake Review Detection** - Powered by Logistic Regression (87% accuracy) & Naive Bayes")

# Sidebar
st.sidebar.header("⚙️ Settings")
model_choice = st.sidebar.selectbox(
    "Model", ["lr", "nb"], 
    format_func=lambda x: "Logistic Regression" if x == "lr" else "Naive Bayes"
)
show_stats = st.sidebar.checkbox("📊 Show Model Statistics", value=True)

# Main prediction
st.header("🔍 Analyze Review")
col1, col2 = st.columns([3,1])

with col1:
    review_text = st.text_area(
        "Enter review text:",
        height=150,
        placeholder="This product is absolutely amazing! Best purchase ever, 10/10 recommend to everyone!"
    )

with col2:
    st.markdown("### Quick Test")
    example_reviews = {
        "Obvious Fake": "AMAZING!!! PERFECT PRODUCT!!! BUY NOW EVERYONE!!!",
        "Subtle Fake": "Really good quality material. Fast shipping too.",
        "Genuine": "The color is nice but stitching came loose after a week. Customer service was helpful though."
    }
    selected_example = st.selectbox("Test with:", list(example_reviews.keys()))
    if st.button("🔥 Load Example"):
        review_text = example_reviews[selected_example]

if st.button("🚀 Analyze Review", type="primary", use_container_width=True) and review_text.strip():
    
    with st.spinner("Analyzing..."):
        # Call predict.py
        input_data = {"text": review_text.strip(), "model": model_choice}
        result = subprocess.run(
            [sys.executable, "predict.py", json.dumps(input_data)],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(__file__)
        )
        
        if result.returncode == 0:
            pred = json.loads(result.stdout)
            
            # Display results
            col_a, col_b, col_c = st.columns(3)
            
            with col_a:
                st.metric(
                    label="Prediction",
                    value=pred["label"],
                    delta=f"{pred['confidence']}% confidence"
                )
            
            with col_b:
                st.metric("Fake Probability", f"{pred['fake_probability']}%")
            
            with col_c:
                st.metric("Genuine Probability", f"{pred['genuine_probability']}%")
            
            # Explanation
            st.subheader("📝 Explanation")
            
            flag_container = st.container()
            with flag_container:
                flag_cols = st.columns(len(pred["explanation"]["flags"]))
                for i, flag in enumerate(pred["explanation"]["flags"]):
                    with flag_cols[i]:
                        badge_type = "failed" if "warning" in flag["type"] else "success"
                        color = 'lightgreen' if badge_type == 'success' else '#fee2e2'
                        border_color = 'green' if badge_type == 'success' else 'red'
                        st.markdown(f"""
                            <div style='padding: 8px; border-radius: 8px; background: {color}; border-left: 4px solid {border_color};'>
                                <strong>{flag['label']}</strong><br>
                                <small>{flag['detail']}</small>
                            </div>
                        """, unsafe_allow_html=True)
            
            st.markdown("**Reasons:**")
            for reason in pred["explanation"]["reasons"]:
                st.caption(f"• {reason}")
            
            # Text stats
            stats = pred["explanation"]["text_stats"]
            st.subheader("📊 Text Analysis")
            col1, col2, col3, col4 = st.columns(4)
            col1.metric("Word Count", stats["word_count"])
            col2.metric("Exclamations", stats["exclamation_marks"])
            col3.metric("CAPS %", f"{stats['caps_percentage']}%")
            col4.metric("Extreme Words", stats["extreme_words"])
            
            # Model stats if shown
            if show_stats:
                st.subheader("🏆 Model Performance")
                model_stats = get_stats()
                if "error" not in model_stats:
                    # Accuracy chart
                    fig = go.Figure(data=[
                        go.Bar(name='Logistic Regression', x=['Accuracy'], y=[model_stats.get('lr_accuracy', 0)]),
                        go.Bar(name='Naive Bayes', x=['Accuracy'], y=[model_stats.get('nb_accuracy', 0)])
                    ])
                    fig.update_layout(title="Model Accuracy", yaxis_range=[0,1], height=400)
                    st.plotly_chart(fig, use_container_width=True)
                    
                    st.json(model_stats)
                else:
                    st.warning(model_stats["error"])
        else:
            st.error(f"Prediction failed: {result.stderr}")

# Footer
st.markdown("---")
st.markdown("Made by Team ReviewGuard | [Full Stack Version](https://github.com/yourusername/fake-review-detector) | Models trained on 8000+ reviews")
