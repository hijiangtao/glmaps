<p align="center"><img width="70%" src="./assets/screenshots/glmaps.png" alt="glmaps logo"></p>

<h1 align="center">glmaps</h1>

<center>

时空数据可视化示例代码集与学习教程。

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c913db53b5a3470f840f5329ea2f54d4)](https://www.codacy.com/app/hijiangtao/glmaps?utm_source=github.com&utm_medium=referral&utm_content=hijiangtao/glmaps&utm_campaign=badger)
[![npm](https://img.shields.io/npm/v/glmaps.svg)](https://www.npmjs.com/package/glmaps)
[![Github All Releases](https://img.shields.io/github/downloads/hijiangtao/glmaps/total.svg)](https://github.com/hijiangtao/glmaps/releases)
[![npm](https://img.shields.io/npm/dt/glmaps.svg)](https://www.npmjs.com/package/glmaps)
[![GitHub contributors](https://img.shields.io/github/contributors/hijiangtao/glmaps.svg)]() 
[![GitHub issues](https://img.shields.io/github/issues/hijiangtao/glmaps.svg)](https://github.com/hijiangtao/glmaps/issues) 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hijiangtao/glmaps/pulls) 
[![license](https://img.shields.io/github/license/hijiangtao/glmaps.svg)](https://github.com/hijiangtao/glmaps/blob/master/LICENSE) 

[![NPM](https://nodei.co/npm/glmaps.png)](https://nodei.co/npm/glmaps/)

</center>

## README 

[英文](./README.md) | [中文](./CN.md)

## glmaps 是什么？

glmaps 是一个包含多个时空数据可视化示例代码集与学习教程的开源项目。该项目中的可视化效果基于可视化库 `three.js` 与 `deck.gl` 实现，非常容易上手，希望本项目对正在时空可视化学习之路上探寻的你有所帮助。

## 目录

1. [概览](#概览) - 快速查阅 `glmaps` 都包含哪些数据可视化形式
2. [ZERO](#ZERO) - 在你进一步阅读本项目之前，想对你说的一些话
3. [Demo](#Demo) - 在本地运行可视化 Demo
4. [从零开始学习时空数据可视化系列教程](#从零开始学习时空数据可视化系列教程) - 暂定八篇
5. [安装](#安装) - 本地安装 `glmaps` 并开始试用（可选）
6. [用法](#用法) - 用法示例
7. [文档](#文档) - `glmaps` API 文档（TBD）
8. [背后的故事](#背后的故事)
9. [联系方式](#联系方式)
10. [协议](#协议)

## 概览

`glmaps` 现包含有如下几种可视化形式，更多案例正在丰富中。其中 `2.5D` 意指在2D地图上绘制2D或者3D的物体，`3D` 意指完全在三维空间中实现时空数据的可视化效果。

|类型|描述|效果|支持动画|支持聚类|
|---|---|---|---|---|
|3D / Curve|THREE.BufferGeometry()| [![](./assets/screenshots/Globe-Curve.jpeg)](./src/globe/index.js) | Yes | No |
|3D / Mover|THREE.SphereGeometry()| [![](./assets/screenshots/Globe-Point.jpeg)](./src/globe/index.js) | Yes | No |
|3D / Cube|THREE.BoxGeometry()| [![](./assets/screenshots/Globe-Cube.jpeg)](./src/globe/index.js) | No | No |
|2.5D / Icon|与 deck 示例一致，无更改| [![](./assets/screenshots/IconLayer.jpeg)](./src/layers/IconLayer/index.js) | No | Yes |
|2.5D / Brush|支持弧线动画| [![](./assets/screenshots/BrushArcLayer.jpeg)](./src/layers/ArcLayer/animate.js) | Yes | No |
|2.5D / Scatter|支持淡出动画| [![](./assets/screenshots/ScatterplotLayer.jpeg)](./src/layers/ScatterplotLayer/index.js) | Yes | No |
|2.5D / Hexagon|支持排序筛选| [![](./assets/screenshots/HexagonLayer.jpeg)](./src/layers/HexagonLayer/index.js) | Yes | Yes |
|2.5D / Grid|支持排序筛选| [![](./assets/screenshots/ScreenGridLayer.jpeg)](./src/layers/ScreenGridLayer/index.js) | No | Yes |
|2.5D / Trip|与 deck 示例一致，无更改| [![](./assets/screenshots/TripLayer.jpeg)](./src/layers/TripLayer/index.js) | Yes | No |
|Other / Segment|与飞线动画效果一致| [![](./assets/screenshots/Globe-CurveSegment.jpeg)](./src/globe/index.js) | No | No |
|Other / Moon|地月系统| [![](./assets/screenshots/Globe-Moon.jpeg)](./src/globe/index.js) | No | No |

## ZERO

首先感谢你对 `glmaps` 项目的关注。在你进一步阅读本项目之前，想对你说的一些话。

**Q: 除了列出的可视化框架，`glmaps` 项目还用到了哪些 Web 技术?**

**React Hooks** is ready in 16.8.0, and `glmaps` get benefits from it at once, if you are not familiar with it, please check [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html) first; On the other hand, deck.gl is **WebGL2** powered geospatial visualization layers, so please make sure your browser support WebGL2. To find out if WebGL(2) is enabled in your browser, go to <http://get.webgl.org/> or <https://get.webgl.org/webgl2/>. 

Besides, if you meet any errors when depoly it locally, you can describe your problem with [issues](https://github.com/hijiangtao/glmaps/issues/new), because that's most likely a problem of `glmaps` rather than yourself, since `glmaps` organizes local development environment from scratch, such as webpack, babel, etc.

**Q: Guidance for visualization beginners?**

I highly recommend you follows these steps in using `glmaps`:
  - Learn how to install three.js and deck.gl from scratch, and code your first "Hello World" with them;
  - Run official demos and get familiar with their API;
  - Follow the tutorials step by step to make your visualization examples more powerful, or check `glmaps` codes in `src` folder directly;
  - (Optional) Use `glmaps` in your demo application;
  - Rewrite `glmaps` example with your own codes;
  - Congratulations on mastering basics of spatio-temporal visualization, you can use `three.js` and `deck.gl` to draw a more fantastic world with spatio-temporal data!

**Q: How to participate in `glmaps` project?**

`glmaps` is still at the very beginning period of my thoughts, you are welcome to oepn ISSUE, PR or email me, if you have any ideas on how to make `glmaps` better for visualization beginners:
  - Participate in implementing tutorials together;
  - Contribute codes to `glmaps` with [PR](https://github.com/hijiangtao/glmaps/pulls) (such as imporve `mover` animation in `Globe`);
  - Speak out your doubts in learning data visualization with [issues](https://github.com/hijiangtao/glmaps/issues/new);
  - Tell me your advice on how to make `glmaps` better with [issues](https://github.com/hijiangtao/glmaps/issues/new);
  - Other aspects not included yet.

## Demo

打开浏览器输入 <https://localhost:8080> 在本地查看 glmaps 演示 Demo 吧。感受一下 `three.js` 与 `deck.gl` 在数据可视化上带给开发者的能力有多强大。

```
git clone git@github.com:hijiangtao/glmaps.git
cd glmaps
npm install
npm run start
```

## 从零开始学习时空数据可视化系列教程

暂定八篇教程，如有需要可以提 [issue]((https://github.com/hijiangtao/glmaps/issues/new)) 讨论。

* 从零开始学习时空可视化（零） / three.js 入门笔记 - TBD
* 从零开始学习时空可视化（一） / deck.gl 入门笔记 - TBD
* 从零开始学习时空可视化（二） / 用 React 框架管理你的 three.js 项目 - TBD
* 从零开始学习时空可视化（三） / 用 three.js 画出你的第一个地球 - TBD
* 从零开始学习时空可视化（四） / 深入浅出 three.js 点、线、面、体的实现过程 - TBD
* 从零开始学习时空可视化（五） / 利用 props 与 transitions 让你的 deck.gl 图层动起来 - TBD
* 从零开始学习时空可视化（六） / 手写 shader 给你的 deck.gl 动画另辟蹊径 - TBD
* 从零开始学习时空可视化（七） / 使用 three.js 和 deck.gl 开发的踩坑记录 - TBD

## 安装

安装 `glmaps`，立刻在你的 demo 中使用上它。

```
cd YOUR_REPO
npm install glmaps --save
```

## 用法

glmaps 的初衷是为了帮助那些在时空可视化领域缺乏基础但充满热情的初学者，利用 three.js 与 deck.gl 的能力帮助他们快速入门，因此 glmaps 不是一个为实际生产环境准备的可视化开源库。然而，glmaps 依然允许你像使用其他 package 一样在项目中正常引入，快写些 demo 试试效果吧。

```javascript
import React from 'react';
import {Globe} from 'glmaps';

/**
 * Data format:
 * [
 *   [
 *      source.lat,
 *      source.lng,
 *      target.lat,
 *      target.lng,
 *   ],
 *   ...
 * ]
 */
const Demo = (props) => {
  return (
    <Globe
      data={props.data}
      id={YOUR_MOUNT_DOM_ID}
      animate={true}
      moon={true}
      visType={'curve'}
    />
  )
};
```

更多示例与详细使用说明请见文档。

## 文档

本部分仍处于完善阶段。然而，你现在就可以直接在 `src` 文件夹下查看所有示例代码集。

* [Layers (2.5D Map)](./layers/README.md)
  1. ArcLayer
  2. HexagonLayer
  3. IconLayer
  4. ScatterplotLayer
  5. ScreenGridLayer
  6. TripLayer
* [Globe (3D Space)](./globe/README.md)
  1. Curve
  2. Mover
  3. Cube
  4. Moon

## 背后的故事

TBD

## 联系方式

@hijiangtao

## 协议

MIT