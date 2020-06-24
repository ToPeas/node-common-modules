const request = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const schedule = require('node-schedule')
const _async = require('async')
const { random } = require('./utils')

let url = 'https://www.mzitu.com/'
let page = 1
let filePath = '/mm1'
let totalPage = null

// 获取 url 文件夹列表
async function getUrl(url, page) {
  let linkArr = []
  if (page > 1) {
    url = url + '/page/' + page
  }
  let ret = await request.get(url)
  console.log('当前抓取的链接:', url)
  const $ = cheerio.load(ret.text)
  $('#pins li').each(function (i, elem) {
    let link = $(this).find('a').attr('href')
    linkArr.push(link)
  })
  return linkArr
}

// 获取图片url 地址
async function getImg(url) {
  let ret = await request.get(url).set({ Referer: 'https://www.mzitu.com/' })
  // console.log(ret.text)
  const $ = cheerio.load(ret.text)
  // 以图集名称来分目录
  const dir = $('.main-title').text()

  // if (await fs.exists(path.join(__dirname, '/mm', dir))) {
  //   console.log(dir + ' 已经文件名存在，跳过下载')
  //   return
  // }

  let presence = true

  console.log(`创建${dir}文件夹`)

  await fs.mkdir(
    path.join(__dirname, filePath, dir),
    { recursive: false },
    (err) => {
      if (err) {
        presence = false
      }
    }
  )
  const pageCount = parseInt($('.pagenavi .dots').next().text())
  const arr = Object.keys(Array.from({ length: pageCount }))
  _async.mapLimit(arr, 2, async (index) => {
    if (!presence) {
      // 避免二次 加载导致的 重复下载
      return false
    }
    let pageUrl = url + '/' + (index + 1)
    try {
      const data = await request.get(pageUrl).set({
        Referer: 'https://www.mzitu.com/',
      })
      const _$ = cheerio.load(data.text)
      // 获取图片的真实地址
      const imgUrl = _$('.main-image img').attr('src')
      download(dir, imgUrl)
      await sleep(random(500, 1100))
    } catch (err) {
      console.log(err)
      getImg(url)
    }
  })

  // for (let i = 1; i <= pageCount; i++) {
  //   if (!presence) {
  //     // 避免二次 加载导致的 重复下载
  //     return false
  //   }
  //   let pageUrl = url + '/' + i
  //   try {
  //     const data = await request.get(pageUrl).set({
  //       Referer: 'https://www.mzitu.com/',
  //     })
  //     const _$ = cheerio.load(data.text)
  //     // 获取图片的真实地址
  //     const imgUrl = _$('.main-image img').attr('src')
  //     download(dir, imgUrl)
  //     await sleep(random(500, 1100))
  //   } catch (err) {
  //     console.log(err)
  //     getImg(url)
  //   }
  // }
}

// 下载图片
function download(dir, imgUrl) {
  console.log(`正在下载${imgUrl}`)
  const filename = imgUrl.split('/').pop()
  const req = request.get(imgUrl).set({ Referer: url })
  req.pipe(fs.createWriteStream(path.join(__dirname, filePath, dir, filename)))
}

// sleep函数
function sleep(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

const getPages = async (params) => {
  let ret = await request.get(url)
  const $ = cheerio.load(ret.text)
  totalPage = $('.nav-links .page-numbers').eq('-2').text()
}

async function init() {
  let urls = []
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 10]
  for (let _page of arr) {
    let page_arr = await getUrl(url, _page)
    urls.push(...page_arr)
  }

  // for (let url of urls) {
  //   await getImg(url)
  // }
  console.log(urls)
  _async.mapLimit(urls, 2, async (url) => {
    await getImg(url)
  })
}

init()
