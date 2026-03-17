<template>
  <view class="page-add-medicine">
    <!-- 状态栏占位 -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏 -->
    <view class="page-header">
      <button class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </button>
      <text class="header-title">添加用药记录</text>
      <button class="save-btn" @click="saveMedicine" :disabled="isSaving">
        <text class="save-text">{{ isSaving ? '保存中...' : '保存' }}</text>
      </button>
    </view>

    <!-- 表单内容区 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <view class="form-container">
        <!-- 药品名称 -->
        <view class="form-item">
          <text class="form-label">药品名称 <text class="required">*</text></text>
          <input 
            class="form-input" 
            v-model="medicineForm.name" 
            placeholder="请输入药品名称（如：降压药、降糖药）"
            placeholder-class="input-placeholder"
          />
        </view>

        <!-- 服用时间 -->
        <view class="form-item">
          <text class="form-label">服用时间 <text class="required">*</text></text>
          <picker 
            mode="time" 
            :value="medicineForm.time" 
            @change="onTimeChange"
            class="form-picker"
          >
            <view class="picker-display">
              {{ medicineForm.time || '请选择服用时间' }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 服用剂量 -->
        <view class="form-item">
          <text class="form-label">服用剂量 <text class="required">*</text></text>
          <view class="dosage-input-wrap">
            <input 
              class="form-input dosage-input" 
              v-model="medicineForm.dosageNum" 
              type="number"
              placeholder="请输入数量"
              placeholder-class="input-placeholder"
            />
            <picker 
              mode="selector" 
              :range="dosageUnits" 
              :value="dosageUnitIndex"
              @change="onDosageUnitChange"
              class="dosage-unit-picker"
            >
              <view class="unit-display">
                {{ dosageUnits[dosageUnitIndex] }}
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
        </view>

        <!-- 服用频率 -->
        <view class="form-item">
          <text class="form-label">服用频率</text>
          <picker 
            mode="selector" 
            :range="frequencyList" 
            :value="frequencyIndex"
            @change="onFrequencyChange"
            class="form-picker"
          >
            <view class="picker-display">
              {{ frequencyList[frequencyIndex] }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 备注信息 -->
        <view class="form-item">
          <text class="form-label">备注说明</text>
          <textarea 
            class="form-textarea" 
            v-model="medicineForm.remark" 
            placeholder="请输入备注信息（如：饭后服用、睡前服用）"
            placeholder-class="input-placeholder"
            maxlength="200"
          ></textarea>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 响应式数据
const medicineForm = ref({
  name: '',         // 药品名称
  time: '',         // 服用时间
  dosageNum: '',    // 剂量数值
  remark: ''        // 备注
});
const dosageUnits = ref(['片', '粒', '包', 'ml', 'mg', '颗']); // 剂量单位
const dosageUnitIndex = ref(0); // 选中的剂量单位索引
const frequencyList = ref(['每日一次', '每日两次', '每日三次', '隔日一次', '每周一次']); // 服用频率
const frequencyIndex = ref(0); // 选中的频率索引
const isSaving = ref(false);   // 保存状态
const scrollViewHeight = ref(0); // 滚动区高度

// 页面挂载时计算高度
onMounted(() => {
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2; // 导航栏高度转px
    scrollViewHeight.value = screenHeight - statusBarH - navBarH;
  } catch (e) {
    scrollViewHeight.value = 600; // 异常降级
  }
});

// 时间选择器变化
const onTimeChange = (e) => {
  medicineForm.value.time = e.detail.value;
};

// 剂量单位变化
const onDosageUnitChange = (e) => {
  dosageUnitIndex.value = e.detail.value;
};

// 服用频率变化
const onFrequencyChange = (e) => {
  frequencyIndex.value = e.detail.value;
};

// 表单验证
const validateForm = () => {
  // 验证药品名称
  if (!medicineForm.value.name.trim()) {
    uni.showToast({ title: '请输入药品名称', icon: 'none' });
    return false;
  }
  // 验证服用时间
  if (!medicineForm.value.time) {
    uni.showToast({ title: '请选择服用时间', icon: 'none' });
    return false;
  }
  // 验证剂量
  if (!medicineForm.value.dosageNum || isNaN(medicineForm.value.dosageNum) || Number(medicineForm.value.dosageNum) <= 0) {
    uni.showToast({ title: '请输入有效的服用剂量', icon: 'none' });
    return false;
  }
  return true;
};

// 保存用药记录
const saveMedicine = () => {
  // 表单验证
  if (!validateForm()) return;

  // 构建完整的用药记录数据
  const newMedicine = {
    name: medicineForm.value.name.trim(),
    time: medicineForm.value.time,
    dosage: `${medicineForm.value.dosageNum}${dosageUnits.value[dosageUnitIndex.value]}`,
    frequency: frequencyList.value[frequencyIndex.value],
    remark: medicineForm.value.remark.trim() || '',
    done: false, // 默认未服用
    createTime: new Date().toLocaleString() // 创建时间
  };

  // 模拟保存（实际项目中替换为接口请求）
  isSaving.value = true;
  setTimeout(() => {
    // 1. 从本地缓存获取现有用药记录
    const existingMedicines = uni.getStorageSync('medicineList') || [];
    // 2. 添加新记录
    existingMedicines.unshift(newMedicine);
    // 3. 保存回缓存
    uni.setStorageSync('medicineList', existingMedicines);
    
    // 提示并返回上一页
    uni.showToast({ title: '添加成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack({ delta: 1 });
    }, 1500);
    
    isSaving.value = false;
  }, 1000);
};

// 返回上一页
const goBack = () => {
  uni.navigateBack({ delta: 1 });
};
</script>

<style scoped>
/* 基础样式 */
.page-add-medicine {
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* 状态栏占位 */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  flex-shrink: 0;
}

/* 顶部导航 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  height: 88rpx;
  flex-shrink: 0;
}
.back-btn {
  background: transparent;
  border: none;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}
.header-title {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}
.save-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 20rpx;
  padding: 10rpx 20rpx;
  font-size: 28rpx;
  color: #fff;
}
.save-btn:disabled {
  opacity: 0.6;
}
.save-text {
  font-size: 28rpx;
  font-weight: 500;
}

/* 内容滚动区 */
.content-scroll {
  overflow-y: auto;
  padding: 30rpx 24rpx;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  box-sizing: border-box;
  flex: none;
  background-color: #f8fafc;
}
.content-scroll::-webkit-scrollbar {
  display: none;
}

/* 表单容器 */
.form-container {
  background: #fff;
  border-radius: 32rpx;
  padding: 30rpx 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

/* 表单项 */
.form-item {
  margin-bottom: 32rpx;
}
.form-item:last-child {
  margin-bottom: 0;
}
.form-label {
  font-size: 28rpx;
  color: #334155;
  font-weight: 600;
  display: block;
  margin-bottom: 12rpx;
}
.required {
  color: #ef4444;
  font-size: 28rpx;
}

/* 输入框样式 */
.form-input {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #1e293b;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
}
.input-placeholder {
  color: #94a3b8;
  font-size: 26rpx;
}

/* 选择器样式 */
.form-picker {
  width: 100%;
}
.picker-display {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #1e293b;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.picker-arrow {
  font-size: 20rpx;
  color: #94a3b8;
}

/* 剂量输入行 */
.dosage-input-wrap {
  display: flex;
  gap: 16rpx;
  align-items: center;
}
.dosage-input {
  flex: 1;
}
.dosage-unit-picker {
  width: 180rpx;
}
.unit-display {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #1e293b;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文本域样式 */
.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 20rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #1e293b;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  line-height: 1.5;
  resize: none;
}

/* 全局按钮重置 */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
</style>