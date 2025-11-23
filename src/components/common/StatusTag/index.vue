<template>
  <span :class="['status-tag', `status-tag--${status}`, size]">
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { PROJECT_STATUS, PROJECT_STATUS_TEXT } from '@/utils/enums'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'default', // small, default, large
    validator: (value) => ['small', 'default', 'large'].includes(value)
  },
  customText: {
    type: String,
    default: ''
  }
})

const statusText = computed(() => {
  if (props.customText) return props.customText
  return PROJECT_STATUS_TEXT[props.status] || props.status
})
</script>

<style scoped>
.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
}

.status-tag.small {
  padding: 2px 8px;
  font-size: 11px;
}

.status-tag.large {
  padding: 6px 16px;
  font-size: 14px;
}

/* 项目状态颜色 */
.status-tag--draft {
  background: #8C8C8C;
}

.status-tag--pending_review {
  background: #FAAD14;
}

.status-tag--rejected {
  background: #F5222D;
}

.status-tag--open {
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
}

.status-tag--reviewing {
  background: #722ED1;
}

.status-tag--announcing {
  background: #FA8C16;
}

.status-tag--agreement_pending {
  background: #13C2C2;
}

.status-tag--in_progress {
  background: #52C41A;
}

.status-tag--completed {
  background: #52C41A;
}

.status-tag--closed {
  background: #8C8C8C;
}
</style>

