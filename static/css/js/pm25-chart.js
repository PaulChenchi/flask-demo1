const chart1 = echarts.init(document.getElementById("main"));
const chart2 = echarts.init(document.getElementById("six-county"));
const chart3 = echarts.init(document.getElementById("county"));
const selectCountyEl = document.querySelector("#selectCounty");

selectCountyEl.addEventListener("change", () => {
    console.log(selectCountyEl.value);
    drawCountyPM25(selectCountyEl.value);
});

window.onresize = function () {
    chart1.resize();
    chart2.resize();
    chart3.resize();
};

//繪製圖形
drawPM25();

//共用繪製函式
function chartPic(chart, title, label, xData, yData, color = "#00008b") {

    let option = {
        title: {
            text: title
        },
        tooltip: {},
        legend: {
            data: [label]
        },
        xAxis: {
            data: xData
        },
        yAxis: {},
        series: [
            {
                itemStyle: {
                    color: color
                },
                name: label,
                type: 'bar',
                data: yData
            }
        ]
    };
    chart.setOption(option);
}

function drawCountyPM25(county) {
    chart3: showLoading();
    $.ajax(
        {
            url: "/county-pm25-json/" + county,
            type: "GET",
            dataType: "json",
            success: (result) => {
                chart3: hideLoading();
                if (!result["success"]) {
                    alert("取得資料失敗!");
                    return;
                }

                console.log(result);
                chartPic(chart3, county, "PM2.5",
                    Object.keys(result["pm25"]),
                    Object.values(result["pm25"]),
                    "#696969"
                )
            },
            error: () => {
                chart3: hideLoading();
                alert("取得資料失敗!");
            }
        }
    )
}

function drawPM25() {
    chart1.showLoading();
    chart2.showLoading();

    $.ajax(
        {
            url: "/pm25-json",
            type: "GET",
            dataType: "json",
            success: (result) => {
                chart1: hideLoading();
                chart2: hideLoading();
                console.log(result);
                //繪製所有站點
                chartPic(chart1, result["title"], "PM2.5", result['xData'], result['yData'])
                //繪製六都數據
                chartPic(chart2, "六都PM2.5平均值", "PM2.5",
                    Object.keys(result["sixData"]),
                    Object.values(result["sixData"]),
                    "#ff69b4");

                drawCountyPM25("新北市");

            },
            error: () => {
                chart1: hideLoading();
                chart2: hideLoading();
                alert("取得資料失敗!");
            }
        }
    )
}