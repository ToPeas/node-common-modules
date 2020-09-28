const axios = require("axios");
const superagent = require("superagent");
const cheerio = require("cheerio");

const crawlerUrl = "https://zw.cdzj.chengdu.gov.cn/lottery/accept/projectList?pageNo=1";

const startCrawler = () => {
  // console.log("start crawler");
  axios.get(crawlerUrl).then((res) => {
    const $ = cheerio.load(res.data);
    const resultArray = [];
    $("#_projectInfo > tr").each((index, item) => {
      // console.log("item\n", item);
      const oneTd = [];
      $(item)
        .find("td")
        .each((_index, _item) => {
          oneTd.push($(_item).text());
        });
      resultArray.push(oneTd);
    });
    console.log(resultArray);
  });
};
