<template>
  <div class="myproject-page">
    <div class="myproject-container">
      <div class="myproject-layout">
        <!-- 侧边栏 -->
        <aside class="sidebar">
          <!-- 发布项目按钮 -->
          <button class="publish-btn" @click="handlePublishProject">
            <el-icon><Plus /></el-icon>
            发布项目
          </button>

          <div class="sidebar-section">
            <div class="sidebar-title">我的项目</div>
            <button
              class="sidebar-item"
              :class="{ active: activeTab === 'published' }"
              @click="activeTab = 'published'"
            >
              我发布的 ({{ nonDraftProjects.length }})
            </button>
          </div>

          <div class="sidebar-section">
            <div class="sidebar-title">草稿箱</div>
            <button
              class="sidebar-item"
              :class="{ active: activeTab === 'drafts' }"
              @click="activeTab = 'drafts'"
            >
              草稿项目 ({{ draftProjects.length }})
            </button>
          </div>
        </aside>

        <!-- 主内容区 -->
        <section class="main-content">
          <!-- 发布项目页面 -->
          <div v-if="activeTab === 'publish'">
            <div class="section-header">
              <h2 class="section-title">发布项目</h2>
            </div>

            <!-- 步骤条 -->
            <el-steps :active="currentStep" align-center class="publish-steps">
              <el-step title="基本信息" description="填写项目基本信息" />
              <el-step title="里程碑配置" description="配置项目里程碑" />
              <el-step title="确认发布" description="确认并提交发布" />
            </el-steps>

            <!-- 步骤1: 基本信息 -->
            <el-form
              v-show="currentStep === 0"
              ref="publishFormRef"
              :model="publishForm"
              :rules="publishRules"
              label-width="120px"
              class="publish-form"
            >
              <!-- 项目基本信息 -->
              <div class="form-section">
                <h3 class="form-section-title">项目基本信息</h3>

                <el-form-item label="项目名称" prop="name">
                  <el-input
                    v-model="publishForm.name"
                    placeholder="请输入项目名称"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item label="项目领域" prop="category">
                  <el-select
                    v-model="publishForm.category"
                    placeholder="请选择项目领域"
                    style="width: 100%"
                  >
                    <el-option label="人工智能" value="人工智能" />
                    <el-option label="大数据" value="大数据" />
                    <el-option label="云计算" value="云计算" />
                    <el-option label="物联网" value="物联网" />
                    <el-option label="区块链" value="区块链" />
                    <el-option label="移动开发" value="移动开发" />
                    <el-option label="Web开发" value="Web开发" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="悬赏金额" prop="reward">
                      <el-input-number
                        v-model="publishForm.reward"
                        :min="1000"
                        :max="1000000"
                        :step="1000"
                        controls-position="right"
                        style="width: 100%"
                      />
                      <span class="form-tip">单位：元，最低1000元</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="项目周期" prop="duration">
                  <el-input-number
                    v-model="publishForm.duration"
                    :min="7"
                    :max="365"
                    controls-position="right"
                    style="width: 100%"
                    @change="calculateDeliveryDate"
                  />
                  <span class="form-tip">单位：天，建议7-180天</span>
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="揭榜截止时间" prop="deadline">
                      <el-date-picker
                        v-model="publishForm.deadline"
                        type="date"
                        placeholder="选择揭榜截止日期"
                        style="width: 100%"
                        :disabled-date="disabledDate"
                        @change="calculateDeliveryDate"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="预计交付时间" prop="deliveryDate">
                      <el-date-picker
                        v-model="publishForm.deliveryDate"
                        type="date"
                        placeholder="自动计算"
                        style="width: 100%"
                        disabled
                      />
                      <span class="form-tip">根据截止时间和项目周期自动计算</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <!-- 项目详情 -->
              <div class="form-section">
                <h3 class="form-section-title">项目详情</h3>

                <el-form-item label="项目详情" prop="description">
                  <el-input
                    v-model="publishForm.description"
                    type="textarea"
                    :rows="12"
                    placeholder="请详细描述项目信息，建议包含以下内容：&#10;&#10;• 项目背景：项目的需求来源和背景说明&#10;• 项目目标：预期达成的目标和成果&#10;• 成果形式：最终交付物的形式（源代码、文档、视频等）&#10;• 功能要求：详细的功能需求和技术规范&#10;• 技术栈要求：所需的技术栈（如 Vue3、Spring Boot 等）&#10;• 性能指标：响应时间、并发数、可用性等要求&#10;• 联系方式：项目联系人及联系电话"
                    maxlength="5000"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item label="任务文件" prop="taskFiles">
                  <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="beforeUpload"
                    :file-list="publishForm.taskFiles"
                    :limit="5"
                    :on-exceed="handleExceed"
                    multiple
                  >
                    <el-button type="primary" plain>
                      <el-icon><Upload /></el-icon>
                      上传文件
                    </el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        支持上传项目相关文档、需求说明等文件，单个文件不超过50MB，最多5个文件
                      </div>
                    </template>
                  </el-upload>
                </el-form-item>
              </div>

              <!-- 揭榜要求 -->
              <div class="form-section">
                <h3 class="form-section-title">揭榜要求</h3>

                <el-form-item label="团队规模" prop="teamSizeRange">
                  <el-row :gutter="20">
                    <el-col :span="11">
                      <el-input-number
                        v-model="publishForm.minTeamSize"
                        :min="2"
                        :max="10"
                        controls-position="right"
                        style="width: 100%"
                        placeholder="最少人数"
                      />
                    </el-col>
                    <el-col :span="2" style="text-align: center; line-height: 32px;">
                      至
                    </el-col>
                    <el-col :span="11">
                      <el-input-number
                        v-model="publishForm.maxTeamSize"
                        :min="publishForm.minTeamSize || 2"
                        :max="20"
                        controls-position="right"
                        style="width: 100%"
                        placeholder="最多人数"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>

                <el-form-item label="项目要求" prop="projectRequirements">
                  <el-input
                    v-model="publishForm.projectRequirements"
                    type="textarea"
                    :rows="4"
                    placeholder="请描述对揭榜团队的要求，如：技能要求、经验要求、工作时间要求等..."
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>

                <!-- TODO: 后端暂不支持 maxApplications 字段，待版本更新后恢复
                <el-form-item label="最大申请数" prop="maxApplications">
                  <el-input-number
                    v-model="publishForm.maxApplications"
                    :min="1"
                    :max="100"
                    controls-position="right"
                    style="width: 200px"
                  />
                  <span class="form-tip" style="margin-left: 10px;">限制最多接收的揭榜申请数量，建议10-30个</span>
                </el-form-item>
                -->
              </div>

              <!-- 步骤1按钮 -->
              <div class="form-actions">
                <el-button size="large" @click="handleCancelPublish">
                  取消
                </el-button>
                <el-button type="primary" size="large" @click="handleNextStep">
                  下一步
                </el-button>
              </div>
            </el-form>

            <!-- 步骤2: 里程碑配置 -->
            <div v-show="currentStep === 1" class="milestone-config-container">
              <div class="milestone-config-header">
                <h3>项目里程碑配置</h3>
                <p class="tip-text">请根据项目实际情况选择和配置里程碑节点。标记为"必选"的里程碑无法取消。</p>
              </div>

              <div class="milestone-list">
                <div
                  v-for="(milestone, index) in milestones"
                  :key="milestone.code"
                  class="milestone-item"
                  :class="{ disabled: !milestone.enabled }"
                >
                  <!-- 里程碑头部 -->
                  <div class="milestone-header">
                    <div class="milestone-header-left">
                      <el-checkbox
                        v-model="milestone.enabled"
                        :disabled="milestone.required"
                        @change="handleMilestoneToggle(milestone)"
                      />
                      <h4 class="milestone-title">
                        {{ milestone.title }}
                        <el-tag v-if="milestone.required" type="danger" size="small">必选</el-tag>
                        <el-tag v-else type="info" size="small">可选</el-tag>
                      </h4>
                    </div>
                    <el-button
                      v-if="milestone.enabled"
                      :icon="milestone.expanded ? 'ArrowUp' : 'ArrowDown'"
                      text
                      @click="milestone.expanded = !milestone.expanded"
                    >
                      {{ milestone.expanded ? '收起' : '展开配置' }}
                    </el-button>
                  </div>

                  <!-- 里程碑描述 -->
                  <div class="milestone-description">
                    {{ milestone.description }}
                  </div>

                  <!-- 里程碑配置表单 -->
                  <div v-show="milestone.enabled && milestone.expanded" class="milestone-config-form">
                    <el-form :model="milestone" label-width="120px">
                      <!-- TODO: 后端暂不支持 goal 字段，待版本更新后恢复
                      <el-form-item label="里程碑目标">
                        <el-input
                          v-model="milestone.goal"
                          type="textarea"
                          :rows="3"
                          placeholder="请描述该里程碑的目标和要求..."
                          maxlength="500"
                          show-word-limit
                        />
                      </el-form-item>
                      -->

                      <el-form-item label="计划开始时间">
                        <el-date-picker
                          v-model="milestone.plannedStartDate"
                          type="date"
                          placeholder="选择计划开始日期"
                          style="width: 100%"
                          :disabled-date="disabledMilestoneDate"
                        />
                      </el-form-item>

                      <el-form-item label="计划结束时间">
                        <el-date-picker
                          v-model="milestone.plannedEndDate"
                          type="date"
                          placeholder="选择计划结束日期"
                          style="width: 100%"
                          :disabled-date="disabledMilestoneDate"
                        />
                      </el-form-item>

                      <!-- TODO: 后端暂不支持 deliverables 字段，待版本更新后恢复
                      <el-form-item label="交付物要求">
                        <div class="deliverables-config">
                          <div
                            v-for="(deliverable, dIndex) in milestone.deliverables"
                            :key="dIndex"
                            class="deliverable-item-config"
                          >
                            <el-input
                              v-model="deliverable.name"
                              placeholder="交付物名称，如：技术方案文档"
                              style="margin-bottom: 8px"
                            />
                            <el-input
                              v-model="deliverable.format"
                              placeholder="文件格式，如：PDF / Word"
                              style="margin-bottom: 8px"
                            />
                            <el-input
                              v-model="deliverable.requirement"
                              type="textarea"
                              :rows="2"
                              placeholder="具体要求，如：不少于10页，需包含系统架构设计..."
                              style="margin-bottom: 8px"
                            />
                            <el-button
                              type="danger"
                              text
                              size="small"
                              @click="removeDeliverable(milestone, dIndex)"
                            >
                              删除交付物
                            </el-button>
                          </div>
                          <el-button
                            type="primary"
                            plain
                            size="small"
                            @click="addDeliverable(milestone)"
                          >
                            + 添加交付物
                          </el-button>
                        </div>
                      </el-form-item>
                      -->

                      <el-form-item label="任务文件">
                        <el-upload
                          class="milestone-upload"
                          :action="uploadUrl"
                          :on-preview="(file) => handleMilestoneFilePreview(milestone, file)"
                          :on-remove="(file, fileList) => handleMilestoneFileRemove(milestone, file, fileList)"
                          :before-upload="beforeUpload"
                 :file-list="milestone.taskFiles"
                          :limit="3"
                          :on-exceed="handleMilestoneFileExceed"
                          multiple
                        >
                          <el-button type="primary" plain size="small">
                            <el-icon><Upload /></el-icon>
                            上传文件
                          </el-button>
                          <template #tip>
                            <div class="el-upload__tip">
                              上传该里程碑相关的任务文件供承接方参考，单个文件不超过50MB，最多3个文件
                            </div>
                          </template>
                        </el-upload>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>

              <!-- 步骤2按钮 -->
              <div class="form-actions">
                <el-button size="large" @click="handlePrevStep">
                  上一步
                </el-button>
                <el-button type="primary" size="large" @click="handleNextStep">
                  下一步
                </el-button>
              </div>
            </div>

            <!-- 步骤3: 确认发布 -->
            <div v-show="currentStep === 2" class="confirm-publish-container">
              <div class="confirm-header">
                <h3>确认发布信息</h3>
                <p class="tip-text">请仔细核对以下信息，确认无误后提交发布。</p>
              </div>

              <div class="confirm-content">
                <!-- 基本信息预览 -->
                <div class="confirm-section">
                  <h4 class="confirm-section-title">项目基本信息</h4>
                  <div class="confirm-info-grid">
                    <div class="confirm-info-item">
                      <span class="label">项目名称：</span>
                      <span class="value">{{ publishForm.name }}</span>
                    </div>
                    <div class="confirm-info-item">
                      <span class="label">项目领域：</span>
                      <span class="value">{{ publishForm.category }}</span>
                    </div>
                    <div class="confirm-info-item">
                      <span class="label">悬赏金额：</span>
                      <span class="value price">￥{{ publishForm.reward }}</span>
                    </div>
                    <div class="confirm-info-item">
                      <span class="label">团队规模：</span>
                      <span class="value">{{ publishForm.minTeamSize }} - {{ publishForm.maxTeamSize }} 人</span>
                    </div>
                    <div class="confirm-info-item">
                      <span class="label">项目周期：</span>
                      <span class="value">{{ publishForm.duration }}天</span>
                    </div>
                    <div class="confirm-info-item">
                      <span class="label">揭榜截止时间：</span>
                      <span class="value">{{ formatDate(publishForm.deadline) }}</span>
                    </div>
                    <div class="confirm-info-item">
                      <span class="label">预计交付时间：</span>
                      <span class="value">{{ formatDate(publishForm.deliveryDate) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 项目详情预览 -->
                <div class="confirm-section">
                  <h4 class="confirm-section-title">项目详情</h4>
                  <div class="confirm-description">
                    <pre class="description-content">{{ publishForm.description || '未填写' }}</pre>
                  </div>
                </div>

                <!-- 里程碑预览 -->
                <div class="confirm-section">
                  <h4 class="confirm-section-title">已选择的里程碑（{{ enabledMilestonesCount }}个）</h4>
                  <div class="milestone-preview-list">
                    <div
                      v-for="milestone in enabledMilestones"
                      :key="milestone.code"
                      class="milestone-preview-item"
                    >
                      <div class="milestone-preview-header">
                        <span class="milestone-preview-title">{{ milestone.title }}</span>
                        <span class="milestone-preview-date">
                          {{ formatDate(milestone.plannedStartDate) }} ~ {{ formatDate(milestone.plannedEndDate) }}
                        </span>
                      </div>
                      <div class="milestone-preview-goal">{{ milestone.description }}</div>
                      <!-- TODO: 后端暂不支持 goal 字段，待版本更新后恢复
                      <div class="milestone-preview-goal">{{ milestone.goal || '未设置目标' }}</div>
                      -->
                      <!-- TODO: 后端暂不支持 deliverables 字段，待版本更新后恢复
                      <div class="milestone-preview-deliverables">
                        交付物：{{ milestone.deliverables.length }}个
                      </div>
                      -->
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤3按钮 -->
              <div class="form-actions">
                <el-button size="large" @click="handlePrevStep">
                  上一步
                </el-button>
                <el-button type="primary" size="large" @click="handleSubmitPublish">
                  提交发布
                </el-button>
              </div>
            </div>
          </div>

          <!-- 我发布的项目 -->
          <div v-else-if="activeTab === 'published'">
            <div class="section-header">
              <h2 class="section-title">我发布的项目</h2>
            </div>

            <div class="project-list">
              <article
                v-for="project in nonDraftProjects"
                :key="project.id"
                class="project-card"
                @click="viewDetail(project)"
              >
                <div class="project-card-main">
                  <div class="project-card-body">
                    <div class="project-card-left">
                      <h3 class="project-name">{{ project.name }}</h3>
                      <div class="project-meta-row">
                        <span>悬赏：{{ project.budgetAmount }}{{ project.currency }}</span>
                        <span>申请团队：{{ project.applicationCount }}个</span>
                        <span>承接团队：{{ project.contractor }}</span>
                        <span>当前里程碑：{{ project.currentMilestone || '--' }}</span>
                      </div>
                    </div>
                    <div class="project-card-right">
                      <span class="project-tag" :class="project.status">{{ project.statusText }}</span>
                      <button
                        type="button"
                        class="ghost-chip manage-btn"
                        @click.stop.prevent="managePublishedProject(project)"
                      >
                        管理项目
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              <div v-if="nonDraftProjects.length === 0" class="empty-state">
                暂无发布的项目
              </div>
            </div>
          </div>

          <!-- 草稿项目 -->
          <div v-else-if="activeTab === 'drafts'">
            <div class="section-header">
              <h2 class="section-title">草稿项目</h2>
            </div>

            <div class="project-list">
              <article
                v-for="project in draftProjects"
                :key="project.id"
                class="project-card"
                @click="viewDetail(project)"
              >
                <div class="project-card-main">
                  <div class="project-card-body">
                    <div class="project-card-left">
                      <h3 class="project-name">{{ project.name }}</h3>
                      <div class="project-meta-row">
                        <span>悬赏：{{ project.budgetAmount }}{{ project.currency }}</span>
                        <span>申请团队：{{ project.applicationCount }}个</span>
                        <span>承接团队：{{ project.contractor }}</span>
                        <span>当前里程碑：{{ project.currentMilestone || '--' }}</span>
                      </div>
                    </div>
                    <div class="project-card-right">
                      <span class="project-tag" :class="project.status">{{ project.statusText }}</span>
                      <button
                        type="button"
                        class="ghost-chip manage-btn"
                        @click.stop.prevent="handlePublishDraft(project)"
                      >
                        去发布
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              <div v-if="draftProjects.length === 0" class="empty-state">
                暂无草稿项目
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { Plus, Document, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import {
  saveProjectDraftAPI,
  getMyProjectsAPI,
  getProjectDetailAPI,
  getAllMilestoneTemplatesAPI,
  getOptionalMilestoneTemplatesAPI,
  getMilestonesByProjectAPI,
  addOptionalMilestonesAPI,
  updateMilestoneAPI,
  publishDraftAPI
} from '@/api/project'

const router = useRouter()
const authStore = useAuthStore()

// 文件上传地址
const uploadUrl = 'http://localhost:8091/api/v1/upload'

// 当前激活的标签页
const activeTab = ref('published')

// 发布步骤
const currentStep = ref(0)

// 当前草稿项目ID（步骤一保存后获取）
const currentProjectId = ref(null)

// 加载状态
const publishLoading = ref(false)

// 我发布的项目（企业作为发布方）
const publishedProjects = ref([])
const projectsLoading = ref(false)
const showDrafts = ref(false)

const draftProjects = computed(() => publishedProjects.value.filter(p => p.status === 'draft'))
const nonDraftProjects = computed(() => publishedProjects.value.filter(p => p.status !== 'draft'))

// 发布项目表单
const publishFormRef = ref(null)
const publishForm = ref({
  name: '',
  category: '',
  reward: 5000,
  duration: 60,
  deadline: '',
  deliveryDate: '',
  description: '',
  taskFiles: [],
  // 揭榜要求
  biddingMode: 'team',
  minTeamSize: 2,
  maxTeamSize: 4,
  projectRequirements: '',
  // TODO: 后端暂不支持 maxApplications 字段，待版本更新后恢复
  // maxApplications: 20
})

// 表单验证规则
const publishRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 5, max: 50, message: '项目名称长度在 5 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择项目领域', trigger: 'change' }
  ],
  reward: [
    { required: true, message: '请输入悬赏金额', trigger: 'blur' },
    { type: 'number', min: 1000, message: '悬赏金额最低1000元', trigger: 'blur' }
  ],
  duration: [
    { required: true, message: '请输入项目周期', trigger: 'blur' },
    { type: 'number', min: 7, max: 365, message: '项目周期在 7 到 365 天之间', trigger: 'blur' }
  ],
  deadline: [
    { required: true, message: '请选择截止时间', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请填写项目详情', trigger: 'blur' },
    { min: 100, message: '项目详情至少100个字符', trigger: 'blur' }
  ]
}

// 计算预计交付时间
const calculateDeliveryDate = () => {
  if (publishForm.value.deadline && publishForm.value.duration) {
    const deadlineDate = new Date(publishForm.value.deadline)
    const deliveryDate = new Date(deadlineDate.getTime() + publishForm.value.duration * 24 * 60 * 60 * 1000)
    publishForm.value.deliveryDate = deliveryDate
  }
}

// 禁用过去的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

// 文件上传相关方法
const handlePreview = (file) => {
  console.log('预览文件:', file)
  // TODO: 实现文件预览功能
}

const handleRemove = (file, fileList) => {
  console.log('删除文件:', file)
  publishForm.value.taskFiles = fileList
}

const beforeUpload = (file) => {
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
    ElMessage.error('上传文件大小不能超过 50MB!')
  }
  return isLt50M
}

const handleExceed = (files, fileList) => {
  ElMessage.warning(`最多只能上传 5 个文件，当前已选择 ${files.length + fileList.length} 个文件`)
}

// 里程碑文件上传相关方法
const handleMilestoneFilePreview = (milestone, file) => {
  console.log('预览里程碑文件:', milestone.code, file)
  // TODO: 实现文件预览功能
}

const handleMilestoneFileRemove = (milestone, file, fileList) => {
  console.log('删除里程碑文件:', milestone.code, file)
  milestone.taskFiles = fileList
}

const handleMilestoneFileExceed = (files, fileList) => {
  ElMessage.warning(`最多只能上传 3 个文件，当前已选择 ${files.length + fileList.length} 个文件`)
}

// 里程碑数据（从后端模板动态生成）
const milestones = ref([])

// 日期格式化为 ISO 字符串（yyyy-MM-dd）
const formatISO = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00`
}

// 从后端模板生成里程碑列表
function buildMilestonesFromTemplates(allTemplates, optionalTemplates) {
  const optionalCodes = new Set(optionalTemplates.map(t => t.milestoneCode))
  return allTemplates
    .sort((a, b) => a.defaultSequenceOrder - b.defaultSequenceOrder)
    .map(t => ({
      code: t.milestoneCode,
      templateId: t.templateId,
      title: t.name,
      description: t.description,
      required: !optionalCodes.has(t.milestoneCode),
      enabled: !optionalCodes.has(t.milestoneCode), // 必选默认启用，可选默认禁用
      expanded: false,
      // TODO: 后端暂不支持 goal 字段，待版本更新后恢复
      // goal: '',
      plannedStartDate: '',
      plannedEndDate: '',
      // TODO: 后端暂不支持 deliverables 字段，待版本更新后恢复
      // deliverables: [],
      taskFiles: [],
    }))
}

// 加载企业项目列表
async function fetchMyProjects() {
  projectsLoading.value = true
  try {
    const res = await getMyProjectsAPI()
    // 拦截器已返回 response.data，res 即 { code, data, message }
    // 后端返回的 data 是对象：{ projects: [...], total, pageNum, pageSize }
    const list = res.data?.projects || []
    const STATUS_TEXT = {
      draft: '草稿', pending_review: '待审核', rejected: '已拒绝',
      published: '已发布', in_progress: '进行中', completed: '已完成', closed: '已关闭'
    }
    publishedProjects.value = list.map(p => ({
      id: p.projectId,
      name: p.title,
      status: p.status || 'draft',
      statusText: STATUS_TEXT[p.status] || p.status,
      budgetAmount: p.budgetAmount ?? '--',
      currency: p.currency || '',
      applicationCount: p.applicationCount ?? 0,
      contractor: p.acceptedTeamName || (p.acceptedTeamId ? '已选定' : '待确定'),
      currentMilestone: p.currentMilestone || ''
    }))
  } catch (err) {
    console.error('获取项目列表失败:', err)
    // 认证失败已由拦截器统一处理，这里只处理其他错误
    if (err?.code !== 'ERR_AUTH_003' && err?.code !== 'ERR_AUTH_001') {
      ElMessage.error('获取项目列表失败')
    }
  } finally {
    projectsLoading.value = false
  }
}

// 计算属性：已启用的里程碑
const enabledMilestones = computed(() => {
  return milestones.value.filter(m => m.enabled)
})

const enabledMilestonesCount = computed(() => {
  return enabledMilestones.value.length
})

// 里程碑切换
const handleMilestoneToggle = (milestone) => {
  if (!milestone.enabled) {
    milestone.expanded = false
  }
}

// TODO: 后端暂不支持 deliverables 字段，待版本更新后恢复
// // 添加交付物
// const addDeliverable = (milestone) => {
//   milestone.deliverables.push({
//     name: '',
//     format: '',
//     requirement: ''
//   })
// }
//
// // 删除交付物
// const removeDeliverable = (milestone, index) => {
//   milestone.deliverables.splice(index, 1)
// }

// 禁用里程碑日期（不能早于揭榜截止时间）
const disabledMilestoneDate = (time) => {
  if (!publishForm.value.deadline) {
    return time.getTime() < Date.now() - 8.64e7
  }
  return time.getTime() < new Date(publishForm.value.deadline).getTime()
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未设置'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 步骤导航
const handleNextStep = async () => {
  // 步骤一 → 步骤二：保存草稿 + 获取projectId + 加载里程碑模板
  if (currentStep.value === 0) {
    // 验证表单
    if (!publishFormRef.value) return
    try {
      await publishFormRef.value.validate()
    } catch {
      ElMessage.error('请完善项目基本信息')
      return
    }

    publishLoading.value = true
    try {
      // 1. 映射字段，保存草稿
      const draftParams = {
        title: publishForm.value.name,
        description: publishForm.value.description,
        categoryId: publishForm.value.category,
        tags: '[]',
        requirements: publishForm.value.projectRequirements,
        skillLevel: 'intermediate',
        teamSizeMin: publishForm.value.minTeamSize,
        teamSizeMax: publishForm.value.maxTeamSize,
        durationDays: publishForm.value.duration,
        budgetType: 'fixed',
        budgetAmount: publishForm.value.reward,
        currency: 'CNY',
        applicationDeadline: formatISO(publishForm.value.deadline),
        expectedStartDate: formatISO(publishForm.value.deadline),
        expectedEndDate: formatISO(publishForm.value.deliveryDate)
      }
      await saveProjectDraftAPI(draftParams)

      // 2. 查询企业项目列表，取最新一条的 projectId
      const projRes = await getMyProjectsAPI()
      const projList = projRes.data?.projects || []
      if (projList.length === 0) {
        ElMessage.error('保存草稿后未能获取到项目，请重试')
        return
      }
      currentProjectId.value = projList[0].projectId

      // 3. 获取里程碑模板
      const [allRes, optRes] = await Promise.all([
        getAllMilestoneTemplatesAPI(),
        getOptionalMilestoneTemplatesAPI()
      ])
      const allTemplates = allRes.data?.templates || []
      const optionalTemplates = optRes.data?.templates || []

      // 4. 生成动态里程碑列表
      milestones.value = buildMilestonesFromTemplates(allTemplates, optionalTemplates)

      currentStep.value = 1
    } catch (err) {
      console.error('步骤一提交失败:', err)
      // 认证失败已由拦截器统一处理
      if (err?.code !== 'ERR_AUTH_003' && err?.code !== 'ERR_AUTH_001') {
        ElMessage.error(err?.info || err?.message || '保存草稿失败，请重试')
      }
    } finally {
      publishLoading.value = false
    }
  }
  // 步骤二 → 步骤三：纯前端切换
  else if (currentStep.value === 1) {
    currentStep.value = 2
  }
}

const handlePrevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 提交发布
const handleSubmitPublish = async () => {
  // 验证第一步：基本信息表单
  if (!publishFormRef.value) return

  try {
    await publishFormRef.value.validate()
  } catch {
    ElMessage.error('请完善项目基本信息')
    currentStep.value = 0
    return
  }

  // 验证第二步：里程碑配置
  const enabledMilestonesList = milestones.value.filter(m => m.enabled)
  if (enabledMilestonesList.length === 0) {
    ElMessage.error('请至少选择一个里程碑')
    currentStep.value = 1
    return
  }

  // 检查每个启用的里程碑是否配置了计划时间
  for (const milestone of enabledMilestonesList) {
    if (!milestone.plannedStartDate || !milestone.plannedEndDate) {
      ElMessage.error(`请设置"${milestone.title}"的计划开始和结束时间`)
      currentStep.value = 1
      return
    }
  }

  publishLoading.value = true
  try {
    const projectId = currentProjectId.value

    // 1. 收集用户启用的可选里程碑 templateIds
    const optionalEnabled = enabledMilestonesList.filter(m => !m.required)
    if (optionalEnabled.length > 0) {
      const templateIds = optionalEnabled.map(m => m.templateId)
      await addOptionalMilestonesAPI({ projectId, templateIds })
    }

    // 2. 重新获取完整里程碑列表（拿到 milestoneId）
    const msRes = await getMilestonesByProjectAPI(projectId)
    const serverMilestones = msRes.data?.milestones || []

    // 3. 逐个更新里程碑信息（通过 milestoneCode 匹配）
    const updatePromises = enabledMilestonesList.map(frontMs => {
      const serverMs = serverMilestones.find(s => s.milestoneCode === frontMs.code)
      if (!serverMs) return Promise.resolve()
      return updateMilestoneAPI({
        milestoneId: serverMs.milestoneId,
        description: frontMs.description,
        plannedStartTime: formatISO(frontMs.plannedStartDate),
        plannedEndTime: formatISO(frontMs.plannedEndDate),
        remindBeforeHours: 24
      })
    })
    await Promise.all(updatePromises)

    // 4. 直接发布（跳过审核）
    await publishDraftAPI(projectId)

    ElMessage.success('项目发布成功！')

    // 重置表单并返回列表
    publishFormRef.value.resetFields()
    milestones.value = []
    currentProjectId.value = null
    currentStep.value = 0
    activeTab.value = 'published'
    // 刷新项目列表
    fetchMyProjects()
  } catch (err) {
    console.error('提交发布失败:', err)
    // 认证失败已由拦截器统一处理
    if (err?.code !== 'ERR_AUTH_003' && err?.code !== 'ERR_AUTH_001') {
      const errMsg = err?.info || err?.message || '提交发布失败，请重试'
      ElMessage.error(errMsg)
    }
  } finally {
    publishLoading.value = false
  }
}

// 取消发布
const handleCancelPublish = () => {
  publishFormRef.value.resetFields()
  currentStep.value = 0
  activeTab.value = 'published'
}

// 查看项目详情
function viewDetail(project) {
  router.push(`/projects/${project.id}`)
}

// 管理发布的项目（跳转到企业方管理页面）
function managePublishedProject(project) {
  console.log('管理发布的项目 ->', project.id)
  router.push(`/enterprise/project/${project.id}/manage`)
}

// 发布项目
function handlePublishProject() {
  console.log('点击发布项目按钮')
  activeTab.value = 'publish'
}

async function handlePublishDraft(project) {
  if (!project?.id) {
    ElMessage.error('草稿项目ID无效，无法加载')
    return
  }

  publishLoading.value = true
  try {
    const [detailRes, allRes, optRes] = await Promise.all([
      getProjectDetailAPI(project.id),
      getAllMilestoneTemplatesAPI(),
      getOptionalMilestoneTemplatesAPI()
    ])

    const detail = detailRes.data || {}

    publishForm.value = {
      ...publishForm.value,
      name: detail.title || '',
      category: detail.categoryId || '',
      reward: Number(detail.budgetAmount ?? 5000),
      duration: Number(detail.durationDays ?? 60),
      deadline: detail.applicationDeadline ? new Date(detail.applicationDeadline) : '',
      deliveryDate: detail.expectedEndDate ? new Date(detail.expectedEndDate) : '',
      description: detail.description || '',
      projectRequirements: detail.requirements || '',
      minTeamSize: Number(detail.teamSizeMin ?? 2),
      maxTeamSize: Number(detail.teamSizeMax ?? 4)
    }

    currentProjectId.value = project.id

    const allTemplates = allRes.data?.templates || []
    const optionalTemplates = optRes.data?.templates || []
    milestones.value = buildMilestonesFromTemplates(allTemplates, optionalTemplates)

    const projectMilestonesRes = await getMilestonesByProjectAPI(project.id)
    const projectMilestones = projectMilestonesRes.data?.milestones || []
    const enabledCodeSet = new Set(projectMilestones.map(item => item.milestoneCode))

    milestones.value.forEach((milestone) => {
      const serverMilestone = projectMilestones.find(item => item.milestoneCode === milestone.code)
      if (!serverMilestone) {
        if (!milestone.required) {
          milestone.enabled = false
        }
        milestone.expanded = false
        return
      }

      milestone.enabled = true
      milestone.plannedStartDate = serverMilestone.plannedStartTime ? new Date(serverMilestone.plannedStartTime) : ''
      milestone.plannedEndDate = serverMilestone.plannedEndTime ? new Date(serverMilestone.plannedEndTime) : ''
      milestone.description = serverMilestone.description || milestone.description
      milestone.expanded = false
    })

    optionalTemplates.forEach((optionalTemplate) => {
      if (enabledCodeSet.has(optionalTemplate.milestoneCode)) return
      const optionalMilestone = milestones.value.find(item => item.code === optionalTemplate.milestoneCode)
      if (!optionalMilestone) return
      optionalMilestone.enabled = false
      optionalMilestone.expanded = false
    })

    currentStep.value = 0
    activeTab.value = 'publish'
    ElMessage.success('草稿已加载，可继续发布')
  } catch (err) {
    console.error('加载草稿失败:', err)
    if (err?.code !== 'ERR_AUTH_003' && err?.code !== 'ERR_AUTH_001') {
      ElMessage.error(err?.info || err?.message || '加载草稿失败，请重试')
    }
  } finally {
    publishLoading.value = false
  }
}

onMounted(() => {
  console.log('企业端"我的项目"页面加载')
  console.log('当前用户角色:', authStore.userRole)
  // 加载企业项目列表
  fetchMyProjects()
})
</script>

<style scoped>
.myproject-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.myproject-container {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
}

.myproject-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

/* 发布项目按钮 */
.publish-btn {
  width: 100%;
  padding: 12px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.publish-btn:hover {
  background: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
}

.publish-btn:active {
  transform: translateY(0);
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 12px;
}

.sidebar-item {
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  text-align: left;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.sidebar-item:hover {
  background: #f5f7fb;
  color: #409eff;
}

.sidebar-item.active {
  background: #ecf5ff;
  color: #409eff;
  font-weight: 500;
}

/* 主内容区 */
.main-content {
  flex: 1;
  min-width: 0;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

/* 项目列表 */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 项目卡片 */
.project-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.project-card-main {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.project-card-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.project-card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.project-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.project-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
}

.project-tag.ongoing {
  background: #e6f7ff;
  color: #1890ff;
}

.project-tag.completed {
  background: #f6ffed;
  color: #52c41a;
}

.project-tag.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.project-tag.published {
  background: #e6f7ff;
  color: #1890ff;
}

.project-tag.in_progress {
  background: #f0f9eb;
  color: #67c23a;
}

.project-tag.completed {
  background: #f6ffed;
  color: #52c41a;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.ghost-chip.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.section-title.underlined {
  border-bottom: 2px solid #409eff;
  padding-bottom: 4px;
}

.draft-toggle {
  border: none;
  color: #606266;
}

.draft-toggle:hover {
  background: #f5f7fa;
  color: #409eff;
}

.draft-toggle.active {
  background: transparent;
  color: #409eff;
  border: none;
  font-weight: 600;
}

.tab-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #606266;
  cursor: pointer;
  padding-bottom: 6px;
  border-bottom: 2px solid transparent;
  user-select: none;
}

.tab-title.tab-active-dark {
  color: #303133;
  border-bottom-color: #303133;
}

.tab-title.tab-active-blue {
  color: #409eff;
  border-bottom-color: #409eff;
}

.project-meta-row {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #606266;
}

.project-content-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.project-brief {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.manage-btn {
  padding: 4px 10px;
  font-size: 12px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.manage-btn:hover {
  background: #66b1ff;
}

.ghost-chip {
  background: transparent;
  border: 1px solid #409eff;
  color: #409eff;
}

.ghost-chip:hover {
  background: #409eff;
  color: #fff;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
  font-size: 14px;
}

/* 空白占位页面 */
.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.empty-placeholder p {
  margin: 0;
  font-size: 16px;
  color: #909399;
}

/* 发布项目表单 */
.publish-form {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 24px;
}

/* 步骤条 */
.publish-steps {
  margin: 24px 0;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 里程碑配置容器 */
.milestone-config-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 24px;
}

.milestone-config-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e8e8e8;
}

.milestone-config-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.tip-text {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 里程碑列表 */
.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.milestone-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px 20px;
  transition: all 0.3s ease;
}

.milestone-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.milestone-item.disabled {
  opacity: 0.6;
  background: #f5f5f5;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.milestone-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.milestone-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.milestone-description {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 0;
  padding-left: 32px;
}

.milestone-config-form {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 6px;
  margin-top: 16px;
}

/* 交付物配置 */
.deliverables-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.deliverable-item-config {
  padding: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

/* 确认发布容器 */
.confirm-publish-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 24px;
}

.confirm-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e8e8e8;
}

.confirm-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.confirm-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.confirm-section {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.confirm-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  padding-left: 12px;
  border-left: 4px solid #1890ff;
}

.confirm-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.confirm-info-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.confirm-info-item .label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  min-width: 120px;
}

.confirm-info-item .value {
  font-size: 14px;
  color: #303133;
  flex: 1;
}

.confirm-info-item .value.price {
  color: #f56c6c;
  font-weight: 600;
  font-size: 16px;
}

/* 里程碑预览 */
.milestone-preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone-preview-item {
  padding: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.milestone-preview-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.milestone-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.milestone-preview-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.milestone-preview-date {
  font-size: 13px;
  color: #909399;
}

.milestone-preview-goal {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 8px;
}

.milestone-preview-deliverables {
  font-size: 13px;
  color: #909399;
}

/* 项目详情预览 */
.confirm-description {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 16px;
}

.description-content {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  padding-left: 12px;
  border-left: 4px solid #1890ff;
}

.form-tip {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.form-actions {
  margin-top: 32px;
  text-align: right;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.form-actions .el-button {
  min-width: 120px;
  margin-left: 12px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .myproject-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .sidebar-section {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .sidebar-title {
    width: 100%;
  }

  .sidebar-item {
    width: auto;
    flex: 1;
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .project-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-meta-row {
    flex-direction: column;
    gap: 8px;
  }

  .project-content-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .manage-btn {
    width: 100%;
  }

  .publish-form {
    padding: 16px;
  }

  .form-actions .el-button {
    width: 100%;
    margin: 8px 0;
  }
}
</style>
