from langgraph.graph import StateGraph, END

from app.graph.state import AgentState

from app.agents.planner import planner_agent
from app.agents.analytics_agent import analytics_agent
from app.agents.visualization_agent import visualization_agent
from app.agents.response_agent import response_agent
from app.agents.insight_agent import insight_agent
from app.agents.explanation_agent import explanation_agent
def planner_node(state: AgentState):
    """
    Planner Node:
    Understand the user's request and create an execution plan.
    """

    state.setdefault("trace", [])
    state["trace"].append("Planner Node")

    state["plan"] = planner_agent(
        state["question"]
    )

    return state


def analytics_node(state: AgentState):
    """
    Analytics Node:
    Execute the business analysis.
    """

    state["trace"].append("Analytics Node")

    state["analysis"] = analytics_agent(
        state["file_path"],
        state["plan"]
    )

    return state


def visualization_node(state: AgentState):
    """
    Visualization Node:
    Convert analytics into chart-ready data.
    """

    state["trace"].append("Visualization Node")

    state["chart"] = visualization_agent(
        state["analysis"]
    )

    return state


def response_node(state: AgentState):
    """
    Response Node:
    Build the final API response.
    """

    state["trace"].append("Response Node")

    state["response"] = response_agent(
        state["question"],
        state["chart"],
        state["insight"]
    )

    # Include execution trace
    state["response"]["trace"] = state["trace"]

    return state
def insight_node(state: AgentState):

    state.setdefault("trace", [])

    state["insight"] = insight_agent(
        state["analysis"]
    )

    state["trace"].append("Insight Node")

    return state
def response_node(state: AgentState):
    """
    Response Node:
    Build the final API response.
    """

    state["trace"].append("Response Node")

    explanation = explanation_agent(
        state["analysis"],
        state["insight"]
    )

    state["response"] = response_agent(
        state["question"],
        state["chart"],
        explanation
    )

    state["response"]["trace"] = state["trace"]

    return state

# -----------------------------
# LangGraph Workflow
# -----------------------------
builder = StateGraph(AgentState)

builder.add_node("planner", planner_node)
builder.add_node("analytics", analytics_node)
builder.add_node("insight", insight_node)
builder.add_node("visualization", visualization_node)
builder.add_node("response", response_node)

builder.set_entry_point("planner")

builder.add_edge("planner", "analytics")
builder.add_edge("analytics", "insight")
builder.add_edge("insight", "visualization")
builder.add_edge("visualization", "response")
builder.add_edge("response", END)

graph = builder.compile()