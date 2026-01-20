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
              我发布的 ({{ publishedProjects.length }})
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
                  <el-col :span="12">
                    <el-form-item label="需求人数" prop="teamSize">
                      <el-input
                        v-model="publishForm.teamSize"
                        placeholder="例如：2-4人"
                      />
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

                <el-form-item label="项目背景" prop="background">
                  <el-input
                    v-model="publishForm.background"
                    type="textarea"
                    :rows="4"
                    placeholder="请描述项目的背景和需求来源，例如：随着人工智能技术的发展，智能客服已成为企业提升服务质量的重要工具..."
                    maxlength="1000"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item label="项目目标" prop="objectives">
                  <el-input
                    v-model="publishForm.objectives"
                    type="textarea"
                    :rows="4"
                    placeholder="请列出项目的主要目标和预期成果，例如：&#10;• 实现7×24小时智能在线客服&#10;• 支持多轮对话和上下文理解&#10;• 集成知识库管理系统"
                    maxlength="1000"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item label="成果形式" prop="deliverableForm">
                  <el-input
                    v-model="publishForm.deliverableForm"
                    type="textarea"
                    :rows="3"
                    placeholder="请描述最终交付的成果形式，例如：&#10;• 完整的系统源代码&#10;• 系统部署文档&#10;• 用户使用手册&#10;• 项目演示视频"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item label="功能要求" prop="requirements">
                  <el-input
                    v-model="publishForm.requirements"
                    type="textarea"
                    :rows="6"
                    placeholder="请详细描述项目的功能要求和技术规范，包括用户管理、核心功能、系统设置等模块的详细需求..."
                    maxlength="2000"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item label="技术栈要求" prop="techStack">
                  <el-input
                    v-model="publishForm.techStack"
                    type="textarea"
                    :rows="3"
                    placeholder="请列出项目所需的技术栈，如：Vue3、Spring Boot、MySQL、Redis等..."
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item label="性能指标" prop="performanceMetrics">
                  <el-input
                    v-model="publishForm.performanceMetrics"
                    type="textarea"
                    :rows="3"
                    placeholder="请描述项目的性能指标要求，如：响应时间、并发用户数、系统可用性等..."
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item label="评审方式" prop="reviewMethod">
                  <el-input
                    v-model="publishForm.reviewMethod"
                    placeholder="请输入评审方式，如：企业评审、专家评审、企业+专家联合评审等"
                    maxlength="100"
                  />
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="项目联系人" prop="contactName">
                      <el-input
                        v-model="publishForm.contactName"
                        placeholder="请输入联系人姓名"
                        maxlength="50"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系电话" prop="contactPhone">
                      <el-input
                        v-model="publishForm.contactPhone"
                        placeholder="请输入联系电话"
                        maxlength="20"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

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

                <el-form-item label="必备技能" prop="requiredSkills">
                  <el-select
                    v-model="publishForm.requiredSkills"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    :reserve-keyword="false"
                    placeholder="请选择或输入必备技能（支持自定义）"
                    style="width: 100%"
                  >
                    <el-option label="Vue.js" value="Vue.js" />
                    <el-option label="React" value="React" />
                    <el-option label="Angular" value="Angular" />
                    <el-option label="Spring Boot" value="Spring Boot" />
                    <el-option label="Node.js" value="Node.js" />
                    <el-option label="Python" value="Python" />
                    <el-option label="Java" value="Java" />
                    <el-option label="MySQL" value="MySQL" />
                    <el-option label="Redis" value="Redis" />
                    <el-option label="MongoDB" value="MongoDB" />
                    <el-option label="Docker" value="Docker" />
                    <el-option label="Kubernetes" value="Kubernetes" />
                    <el-option label="微信小程序" value="微信小程序" />
                    <el-option label="Android" value="Android" />
                    <el-option label="iOS" value="iOS" />
                    <el-option label="人工智能" value="人工智能" />
                    <el-option label="机器学习" value="机器学习" />
                    <el-option label="数据分析" value="数据分析" />
                  </el-select>
                </el-form-item>

                <el-form-item label="加分技能" prop="bonusSkills">
                  <el-select
                    v-model="publishForm.bonusSkills"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    :reserve-keyword="false"
                    placeholder="请选择或输入加分技能（可选）"
                    style="width: 100%"
                  >
                    <el-option label="UI/UX设计" value="UI/UX设计" />
                    <el-option label="软件测试" value="软件测试" />
                    <el-option label="项目管理" value="项目管理" />
                    <el-option label="敏捷开发" value="敏捷开发" />
                    <el-option label="DevOps" value="DevOps" />
                    <el-option label="云计算" value="云计算" />
                    <el-option label="大数据" value="大数据" />
                    <el-option label="区块链" value="区块链" />
                    <el-option label="网络安全" value="网络安全" />
                    <el-option label="英语能力" value="英语能力" />
                  </el-select>
                </el-form-item>

                <el-form-item label="经验要求" prop="experienceRequirement">
                  <el-radio-group v-model="publishForm.experienceRequirement">
                    <el-radio value="none">无经验要求</el-radio>
                    <el-radio value="basic">有基础项目经验</el-radio>
                    <el-radio value="intermediate">有中级项目经验（1-2个项目）</el-radio>
                    <el-radio value="advanced">有高级项目经验（3个以上项目）</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="其他要求" prop="otherRequirements">
                  <el-input
                    v-model="publishForm.otherRequirements"
                    type="textarea"
                    :rows="4"
                    placeholder="请描述其他特殊要求，如：需要有开源项目经验、需要通过特定认证、工作时间要求等..."
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>

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

                      <el-form-item label="计划完成时间">
                        <el-date-picker
                          v-model="milestone.plannedDate"
                          type="date"
                          placeholder="选择计划完成日期"
                          style="width: 100%"
                          :disabled-date="disabledMilestoneDate"
                        />
                      </el-form-item>

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
                      <span class="label">需求人数：</span>
                      <span class="value">{{ publishForm.teamSize }}</span>
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
                    <div class="confirm-info-item">
                      <span class="label">项目联系人：</span>
                      <span class="value">{{ publishForm.contactName }}</span>
                    </div>
                    <div class="confirm-info-item">
                      <span class="label">联系电话：</span>
                      <span class="value">{{ publishForm.contactPhone }}</span>
                    </div>
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
                        <span class="milestone-preview-date">{{ formatDate(milestone.plannedDate) }}</span>
                      </div>
                      <div class="milestone-preview-goal">{{ milestone.goal || '未设置目标' }}</div>
                      <div class="milestone-preview-deliverables">
                        交付物：{{ milestone.deliverables.length }}个
                      </div>
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
              <h2 class="section-title">
                我发布的项目 ({{ publishedProjects.length }})
              </h2>
            </div>

            <div class="project-list">
              <article
                v-for="project in publishedProjects"
                :key="project.id"
                class="project-card"
                @click="viewDetail(project)"
              >
                <div class="project-card-main">
                  <div class="project-card-header">
                    <h3 class="project-name">{{ project.name }}</h3>
                    <span class="project-tag" :class="project.status">
                      {{ project.statusText }}
                    </span>
                  </div>

                  <div class="project-meta-row">
                    <span>状态：{{ project.stageText }}</span>
                    <span>剩余时间：{{ project.remainDays }}天</span>
                    <span>承接方：{{ project.contractor || '待确定' }}</span>
                  </div>

                  <div class="project-content-row">
                    <p class="project-brief">{{ project.brief }}</p>
                    <button
                      type="button"
                      class="ghost-chip manage-btn"
                      @click.stop.prevent="managePublishedProject(project)"
                    >
                      管理项目
                    </button>
                  </div>
                </div>
              </article>

              <div v-if="publishedProjects.length === 0" class="empty-state">
                暂无发布的项目
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
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

// 文件上传地址
const uploadUrl = 'http://localhost:8091/api/v1/upload'

// 当前激活的标签页
const activeTab = ref('published')

// 发布步骤
const currentStep = ref(0)

// 我承接的项目（企业作为承接方）- 已删除
const contractedProjects = ref([])

// 我发布的项目（企业作为发布方）
const publishedProjects = ref([
  {
    id: 'proj-001',
    name: 'AI智能客服系统开发',
    status: 'ongoing',
    statusText: '进行中',
    stageText: '方案提交阶段',
    remainDays: 45,
    contractor: '张三团队',
    publisher: 'XX科技有限公司',
    brief: '为平台构建基于NLP的智能客服系统，提高客户服务效率和满意度。'
  },
  {
    id: 'proj-002',
    name: '企业数据分析平台',
    status: 'ongoing',
    statusText: '进行中',
    stageText: '项目执行阶段',
    remainDays: 30,
    contractor: '李四团队',
    publisher: 'XX科技有限公司',
    brief: '开发企业级数据分析平台，支持多维度数据可视化和智能报表生成。'
  },
  {
    id: 'proj-003',
    name: '移动端电商APP',
    status: 'completed',
    statusText: '已完成',
    stageText: '项目结算',
    remainDays: 0,
    contractor: '王五团队',
    publisher: 'XX科技有限公司',
    brief: '开发一款功能完善的移动端电商应用，包含商品展示、购物车、支付等功能。'
  }
])

// 发布项目表单
const publishFormRef = ref(null)
const publishForm = ref({
  name: '',
  category: '',
  reward: 5000,
  teamSize: '',
  duration: 60,
  deadline: '',
  deliveryDate: '',
  background: '',
  objectives: '',
  deliverableForm: '',
  requirements: '',
  techStack: '',
  performanceMetrics: '',
  reviewMethod: '',
  contactName: '',
  contactPhone: '',
  taskFiles: [],
  // 揭榜要求
  biddingMode: 'team',
  minTeamSize: 2,
  maxTeamSize: 4,
  requiredSkills: [],
  bonusSkills: [],
  experienceRequirement: 'none',
  educationRequirement: 'none',
  gradeRequirement: [],
  otherRequirements: '',
  reviewProcess: 'mixed',
  maxApplications: 20
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
  teamSize: [
    { required: true, message: '请输入需求人数', trigger: 'blur' }
  ],
  duration: [
    { required: true, message: '请输入项目周期', trigger: 'blur' },
    { type: 'number', min: 7, max: 365, message: '项目周期在 7 到 365 天之间', trigger: 'blur' }
  ],
  deadline: [
    { required: true, message: '请选择截止时间', trigger: 'change' }
  ],
  background: [
    { required: true, message: '请描述项目背景', trigger: 'blur' },
    { min: 50, message: '项目背景至少50个字符', trigger: 'blur' }
  ],
  objectives: [
    { required: true, message: '请列出项目目标', trigger: 'blur' },
    { min: 50, message: '项目目标至少50个字符', trigger: 'blur' }
  ],
  deliverableForm: [
    { required: true, message: '请描述成果形式', trigger: 'blur' }
  ],
  requirements: [
    { required: true, message: '请描述功能要求', trigger: 'blur' },
    { min: 100, message: '功能要求至少100个字符', trigger: 'blur' }
  ],
  techStack: [
    { required: true, message: '请列出技术栈要求', trigger: 'blur' }
  ],
  reviewMethod: [
    { required: true, message: '请输入评审方式', trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: '请输入项目联系人', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
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

// 里程碑数据
const milestones = ref([
  {
    code: 'proposal',
    title: '方案提交',
    description: '提交详细的技术方案和项目实施计划，包括系统架构设计、技术选型、进度安排等',
    required: true,
    enabled: true,
    expanded: false,
    goal: '',
    plannedDate: '',
    taskFiles: [],
    deliverables: [
      { name: '技术方案文档', format: 'PDF / Word', requirement: '不少于10页，需包含系统架构设计、技术选型依据' },
      { name: '项目计划甘特图', format: 'Excel / Project / PDF', requirement: '详细到周级别的任务分解' }
    ]
  },
  {
    code: 'agreement',
    title: '协议签订',
    description: '双方签订正式的项目合作协议，明确权利义务、交付标准、验收条件等',
    required: true,
    enabled: true,
    expanded: false,
    goal: '',
    plannedDate: '',
    taskFiles: [],
    deliverables: [
      { name: '项目合作协议', format: 'PDF', requirement: '双方签字盖章的正式协议' }
    ]
  },
  {
    code: 'midterm',
    title: '中期答辩',
    description: '项目进行到中期时，进行阶段性成果展示和答辩，评估项目进展情况',
    required: false,
    enabled: false,
    expanded: false,
    goal: '',
    plannedDate: '',
    taskFiles: [],
    deliverables: [
      { name: '中期报告', format: 'PDF / PPT', requirement: '包含已完成工作、遇到的问题、下一步计划' },
      { name: '演示视频', format: 'MP4', requirement: '展示当前系统功能' }
    ]
  },
  {
    code: 'result_submit',
    title: '成果提交',
    description: '提交项目最终成果，包括源代码、文档、部署包等所有交付物',
    required: true,
    enabled: true,
    expanded: false,
    goal: '',
    plannedDate: '',
    taskFiles: [],
    deliverables: [
      { name: '源代码', format: 'ZIP / Git仓库', requirement: '完整的项目源代码，包含README' },
      { name: '部署文档', format: 'PDF / Markdown', requirement: '详细的部署和配置说明' },
      { name: '用户手册', fmat: 'PDF', requirement: '面向最终用户的使用手册' }
    ]
  },
  {
    code: 'result_review',
    title: '成果评审',
    description: '企业和专家对项目成果进行评审，评估是否达到预期目标和质量标准',
    required: false,
    enabled: false,
    expanded: false,
    goal: '',
    plannedDate: '',
    taskFiles: [],
    deliverables: []
  },
  {
    code: 'settlement',
    title: '项目结算',
    description: '项目验收通过后，进行费用结算和支付',
    required: true,
    enabled: true,
    expanded: false,
    goal: '',
    plannedDate: '',
    taskFiles: [],
    deliverables: [
      { name: '验收报告', format: 'PDF', requirement: '项目验收通过的正式报告' },
      { name: '发票', format: 'PDF / 纸质', requirement: '符合财务要求的正式发票' }
    ]
  },
  {
    code: 'publicity',
    title: '结项公示',
    description: '项目结项后进行公示，接受监督和申诉',
    required: false,
    enabled: false,
    expanded: false,
    goal: '',
    plannedDate: '',
    taskFiles: [],
    deliverables: []
  }
])

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

// 添加交付物
const addDeliverable = (milestone) => {
  milestone.deliverables.push({
    name: '',
    format: '',
    requirement: ''
  })
}

// 删除交付物
const removeDeliverable = (milestone, index) => {
  milestone.deliverables.splice(index, 1)
}

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
const handleNextStep = () => {
  // 直接进入下一步，不做验证
  if (currentStep.value < 2) {
    currentStep.value++
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

  let isValid = false
  await publishFormRef.value.validate((valid) => {
    isValid = valid
    if (!valid) {
      ElMessage.error('请完善项目基本信息')
      currentStep.value = 0 // 跳转到第一步
    }
  })

  if (!isValid) return

  // 验证第二步：里程碑配置
  const enabledMilestonesList = milestones.value.filter(m => m.enabled)
  if (enabledMilestonesList.length === 0) {
    ElMessage.error('请至少选择一个里程碑')
    currentStep.value = 1 // 跳转到第二步
    return
  }

  // 检查每个启用的里程碑是否配置完整
  for (const milestone of enabledMilestonesList) {
    if (!milestone.goal) {
      ElMessage.error(`请配置"${milestone.title}"的里程碑目标`)
      currentStep.value = 1 // 跳转到第二步
      return
    }
    if (!milestone.plannedDate) {
      ElMessage.error(`请设置"${milestone.title}"的计划完成时间`)
      currentStep.value = 1 // 跳转到第二步
      return
    }
  }

  // 所有验证通过，提交发布
  console.log('提交发布项目:', {
    basicInfo: publishForm.value,
    milestones: enabledMilestones.value
  })

  ElMessage.success('项目发布成功！')
  // TODO: 调用API提交项目

  // 重置表单并返回列表
  publishFormRef.value.resetFields()
  currentStep.value = 0
  activeTab.value = 'published'
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

onMounted(() => {
  console.log('企业端"我的项目"页面加载')
  console.log('当前用户角色:', authStore.userRole)
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
  gap: 12px;
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
  padding: 8px 16px;
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
