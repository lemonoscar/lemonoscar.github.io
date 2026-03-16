# Flying Hand: End-Effector-Centric Framework for Versatile Aerial Manipulation Teleoperation and Policy Learning

## 2.23-3.2周报.md

+ 了解一下基本的任务设定：
    - 工作关注的核心是具备机械臂的无人机在真实的三维环境中的操作任务，核心任务范式主要是保持飞行稳定的前提下，完成更加精细化末端执行器（end-effector）交互任务。
    - 相当于是在一个开放的空中移动基座下，围绕这个UAM（uncrewed aerial manipulators）做一些末端的任务，主要任务设置如下：
        * Approach & Alignment ：在三维空间中自主飞行到目标物体附近，调整姿态以实现机械臂的可达性，精确对准末端执行器与目标交互点
        * Contact-rich Aerial Manipulation ：空中接触包括有按按钮，触碰开关，扭灯泡，插入式的操作等等
        * Aerial Grasping & Transport ：抓取轻量物体，搬运至指定位置以及空中保持物体稳定
        * Teleoperation Scenarios ：远程操控指的是，人类通过手柄或者空间输入设备来控制末端执行器，也就是人类控制+无人机的自动补偿。
