from langgraph.graph import StateGraph, END

from app.graph.state import AgentState

from app.agents.planner import planner_agent
from app.agents.analytics_agent import analytics_agent
from app.agents.visualization_agent import visualization_agent
from app.agents.response_agent import response_agent
from app.agents.insight_agent import insight_agent
from app.agents.explanation_agent import explanation_agent
from app.agents.router_agent import router_agent
from app.agents.validator_agent import validator_agent
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

    state["trace"].append("Analytics Node")

    state["analysis"] = analytics_agent(
        state["file_path"],
        state["plan"]
    )

    print("\n===== ANALYSIS DEBUG =====")
    print(type(state["analysis"]))
    print(state["analysis"])
    print("==========================\n")

    return state


def visualization_node(state: AgentState):
    """
    Visualization Node:
    Convert analytics into chart-ready data.
    """

    state.setdefault("trace", [])

    print("\n===== BEFORE VISUALIZATION =====")
    print(state["analysis"])
    print("===============================")

    state["chart"] = visualization_agent(
        state["analysis"],
        state["plan"]
)

    print("\n===== GENERATED CHART =====")
    print(state["chart"])
    print("===========================")

    state["trace"].append("Visualization Node")

    return state


def response_node(state: AgentState):
    """
    Response Node:
    Build final API response based on executed route.
    """

    state.setdefault("trace", [])

    state["trace"].append(
        "Response Node"
    )

    explanation = explanation_agent(
        state.get("analysis"),
        state.get("insight")
    )


    state["response"] = response_agent(
        question=state["question"],
        route=state.get("route"),

        analytics_result=state.get(
            "analysis"
        ),

        insight=explanation,

        chart=state.get(
            "chart"
        )
    )


    # Include execution trace
    state["response"]["trace"] = state["trace"]


    return state
def insight_node(state: AgentState):

    state.setdefault("trace", [])

    print("\n===== BEFORE INSIGHT =====")
    print(type(state["analysis"]))
    print(state["analysis"])
    print("==========================")

    state["insight"] = insight_agent(
        state["analysis"]
    )

    print("\n===== GENERATED INSIGHT =====")
    print(state["insight"])
    print("============================")

    state["trace"].append("Insight Node")

    return state
def router_node(state: AgentState):
    """
    Decide which workflow path should be executed.
    """

    state.setdefault("trace", [])

    state["route"] = router_agent(state["plan"])

    state["trace"].append(
        f"Router Node → {state['route']}"
    )

    return state
def route_decision(state: AgentState):
    """
    Return the next node based on the selected route.
    """

    return state["route"]
def validator_node(state: AgentState):
    """
    Semantic Validator Node:
    Ensures planner uses only governed metrics.
    """

    state.setdefault("trace", [])

    state["trace"].append(
        "Semantic Validator Node"
    )

    validation = validator_agent(
        state["plan"]
    )

    state["validation"] = validation


    if not validation["valid"]:
        state["error"] = validation["error"]


    return state

# -----------------------------
# LangGraph Workflow
# -----------------------------
builder = StateGraph(AgentState)

builder.add_node("planner", planner_node)
builder.add_node("validator", validator_node)
builder.add_node("router", router_node)
builder.add_node("analytics", analytics_node)
builder.add_node("insight", insight_node)
builder.add_node("visualization", visualization_node)
builder.add_node("response", response_node)
builder.set_entry_point("planner")

builder.add_edge(
    "planner",
    "validator"
)

builder.add_edge(
    "validator",
    "router"
)

builder.add_conditional_edges(
    "router",
    route_decision,
    {
        "analytics": "analytics",
        "insight": "analytics",
        "visualization": "analytics",
    }
)
builder.add_edge(
    "analytics",
    "insight"
)

builder.add_edge(
    "insight",
    "visualization"
)

builder.add_edge(
    "visualization",
    "response"
)

builder.add_edge("response", END)

graph = builder.compile()