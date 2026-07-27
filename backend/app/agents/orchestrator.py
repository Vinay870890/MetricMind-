from app.agents.planner import planner_agent
from app.agents.analytics_agent import analytics_agent
from app.agents.visualization_agent import visualization_agent
from app.agents.response_agent import response_agent


def run_agents(question: str, file_path: str):
    """
    Execute the complete AI agent workflow.
    """

    trace = []

    trace.append("Planner Agent started")

    plan = planner_agent(question)

    trace.append(f"Planner extracted: {plan}")

    analysis = analytics_agent(file_path, plan)

    trace.append("Analytics Agent completed")

    chart = visualization_agent(analysis)

    trace.append("Visualization Agent completed")

    response = response_agent(question, chart)

    trace.append("Response Agent completed")

    response["agent_trace"] = trace

    return response