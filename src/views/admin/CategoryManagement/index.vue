<template>
  <div class="category-management">
    <div class="page-header">
      <h2>项目分类管理</h2>
      <el-button type="primary" @click="handleCreate">新建分类</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="name" label="分类名称" width="150" />
      <el-table-column prop="parentName" label="父分类" width="150" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="icon" label="图标" width="100" />
      <el-table-column prop="sortOrder" label="排序" width="80" />
      <el-table-column label="可见性" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isVisible ? 'success' : 'info'">
            {{ row.isVisible ? '可见' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'danger'">
            {{ row.isActive ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新建分类'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父分类" prop="parentId">
          <el-select v-model="formData.parentId" placeholder="请选择父分类" clearable style="width: 100%">
            <el-option label="无" :value="null" />
            <el-option
              v-for="item in tableData"
              :key="item.categoryId"
              :label="item.name"
              :value="item.categoryId"
            />
          </el-select>
        </el-form-item>
