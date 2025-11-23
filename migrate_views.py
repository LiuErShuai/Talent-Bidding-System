#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
视图文件迁移脚本
将views目录下的文件迁移到新的目录结构中
"""
import os
import shutil
from pathlib import Path

# 文件迁移映射
MIGRATIONS = [
    # 认证模块
    ("src/views/Login.vue", "src/views/auth/Login/index.vue"),
    ("src/views/Register.vue", "src/views/auth/Register/index.vue"),
    # 首页
    ("src/views/Home.vue", "src/views/home/index.vue"),
    # 项目公共模块
    ("src/views/ProjectHall.vue", "src/views/project/Hall/index.vue"),
    ("src/views/ProjectDetails.vue", "src/views/project/Detail/index.vue"),
    ("src/views/Tracker.vue", "src/views/project/Tracker/index.vue"),
    # 学生模块
    ("src/views/Apply.vue", "src/views/student/Apply/index.vue"),
    ("src/views/Submit.vue", "src/views/student/Submit/index.vue"),
    ("src/views/GrowthCenter.vue", "src/views/student/GrowthCenter/index.vue"),
    ("src/views/SmartMatch.vue", "src/views/student/SmartMatch/index.vue"),
    # 企业模块 - 注意MyProject和Evaluation需要根据角色区分
    ("src/views/ResultsCenter.vue", "src/views/enterprise/ResultsCenter/index.vue"),
    # 管理员模块
    ("src/views/PreReview.vue", "src/views/admin/PreReview/index.vue"),
    ("src/views/FinalReview.vue", "src/views/admin/FinalReview/index.vue"),
    ("src/views/MidtermDefense.vue", "src/views/admin/MidtermDefense/index.vue"),
    ("src/views/DataCenter.vue", "src/views/admin/DataCenter/index.vue"),
    ("src/views/AgreementProcessing.vue", "src/views/admin/AgreementProcessing/index.vue"),
    # 用户中心
    ("src/views/User.vue", "src/views/user/Profile/index.vue"),
    # 消息中心
    ("src/views/Message.vue", "src/views/message/index.vue"),
    # 信息页面
    ("src/views/About.vue", "src/views/info/About/index.vue"),
    ("src/views/Contact.vue", "src/views/info/Contact/index.vue"),
    ("src/views/Help.vue", "src/views/info/Help/index.vue"),
    ("src/views/Privacy.vue", "src/views/info/Privacy/index.vue"),
]

# 需要特殊处理的文件（MyProject和Evaluation在不同角色下复用）
SPECIAL_FILES = [
    ("src/views/MyProject.vue", [
        "src/views/student/MyProject/index.vue",
        "src/views/enterprise/MyProject/index.vue"
    ]),
    ("src/views/Evaluation.vue", [
        "src/views/enterprise/Evaluation/index.vue",
        "src/views/teacher/Evaluation/index.vue"
    ]),
]

def ensure_dir(file_path):
    """确保目标目录存在"""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

def migrate_file(source, destination):
    """迁移单个文件"""
    if not os.path.exists(source):
        print(f"⚠️  源文件不存在: {source}")
        return False
    
    ensure_dir(destination)
    
    try:
        shutil.move(source, destination)
        print(f"✅ 已迁移: {source} -> {destination}")
        return True
    except Exception as e:
        print(f"❌ 迁移失败: {source} -> {destination}, 错误: {e}")
        return False

def migrate_special_file(source, destinations):
    """迁移特殊文件（需要复制到多个位置）"""
    if not os.path.exists(source):
        print(f"⚠️  源文件不存在: {source}")
        return False
    
    success_count = 0
    for dest in destinations:
        ensure_dir(dest)
        try:
            shutil.copy2(source, dest)
            print(f"✅ 已复制: {source} -> {dest}")
            success_count += 1
        except Exception as e:
            print(f"❌ 复制失败: {source} -> {dest}, 错误: {e}")
    
    # 所有目标都复制成功后，删除源文件
    if success_count == len(destinations):
        try:
            os.remove(source)
            print(f"✅ 已删除源文件: {source}")
        except Exception as e:
            print(f"⚠️  删除源文件失败: {source}, 错误: {e}")
    
    return success_count == len(destinations)

def main():
    print("=" * 60)
    print("开始迁移视图文件...")
    print("=" * 60)
    
    # 迁移普通文件
    success_count = 0
    for source, dest in MIGRATIONS:
        if migrate_file(source, dest):
            success_count += 1
    
    print(f"\n普通文件迁移完成: {success_count}/{len(MIGRATIONS)}")
    
    # 迁移特殊文件
    print("\n开始迁移特殊文件（需要复制到多个位置）...")
    for source, destinations in SPECIAL_FILES:
        migrate_special_file(source, destinations)
    
    print("\n" + "=" * 60)
    print("迁移完成！")
    print("=" * 60)
    print("\n⚠️  注意: 迁移完成后需要:")
    print("1. 更新 src/router/index.js 中的import路径")
    print("2. 检查并更新所有组件内的相对路径引用")
    print("3. 对于MyProject和Evaluation，需要根据用户角色动态加载对应文件")

if __name__ == "__main__":
    main()

