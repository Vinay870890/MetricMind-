import streamlit as st
import requests
import plotly.express as px


API_URL = "http://127.0.0.1:8000"


st.set_page_config(
    page_title="MetricMind X Dashboard",
    layout="wide"
)


st.title("MetricMind X Dashboard Viewer")


dashboard_id = st.text_input(
    "Dashboard ID"
)


if dashboard_id:

    response = requests.get(
        f"{API_URL}/api/dashboard/{dashboard_id}"
    )


    if response.status_code == 200:

        data = response.json()


        st.write("DEBUG RESPONSE")

        st.json(data)


        # Extract dashboard
        dashboard = data.get(
            "dashboard",
            {}
        ).get(
                "dashboard",
            {}
        )


        st.header(
            dashboard.get(
                "title",
                "MetricMind Dashboard"
            )
        )


        widgets = dashboard.get(
            "widgets",
            []
        )


        st.write(
            "Widgets found:",
            len(widgets)
        )


        for widget in widgets:


            widget_type = widget.get(
                "type"
            )


            if widget_type == "kpi":


                st.metric(
                    label=widget.get("title"),
                    value=widget.get("value")
                )


            elif widget_type == "chart":


                config = widget.get(
                    "config",
                    {}
                )


                labels = config.get(
                    "labels",
                    []
                )


                values = config.get(
                    "values",
                    []
                )


                if labels and values:


                    fig = px.bar(
                        x=labels,
                        y=values,
                        title=config.get(
                            "title",
                            "Chart"
                        )
                    )


                    st.plotly_chart(
                        fig,
                        use_container_width=True
                    )

    else:

        st.error(
            "Dashboard not found"
        )