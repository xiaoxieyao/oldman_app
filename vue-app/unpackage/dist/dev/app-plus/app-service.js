if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_SHOW = "onShow";
  const ON_LOAD = "onLoad";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createLifeCycleHook(
    ON_SHOW,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
    2
    /* HookFlags.PAGE */
  );
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$f = {
    __name: "auth",
    setup(__props, { expose: __expose }) {
      __expose();
      const phoneNumber = vue.ref("");
      const password = vue.ref("");
      const rememberPwd = vue.ref(false);
      const isLoading = vue.ref(false);
      const focusInput = () => {
        uni.pageScrollTo({ scrollTop: 0 });
      };
      const handleCheckboxChange = (e) => {
        rememberPwd.value = e.detail.value;
      };
      const switchAuthTab = (type) => {
      };
      const login = () => {
        if (!phoneNumber.value) {
          uni.showToast({ title: "请输入手机号", icon: "none" });
          return;
        }
        if (!/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
          uni.showToast({ title: "手机号格式错误", icon: "none" });
          return;
        }
        if (!password.value || password.value.length < 6) {
          uni.showToast({ title: "密码不能少于6位", icon: "none" });
          return;
        }
        isLoading.value = true;
        setTimeout(() => {
          isLoading.value = false;
          uni.setStorageSync("isLogin", true);
          if (rememberPwd.value) {
            uni.setStorageSync("savedPhone", phoneNumber.value);
            uni.setStorageSync("savedPwd", password.value);
          } else {
            uni.removeStorageSync("savedPhone");
            uni.removeStorageSync("savedPwd");
          }
          uni.switchTab({
            url: "/pages/device/device",
            fail: (err) => {
              uni.reLaunch({ url: "/pages/device/device" });
              formatAppLog("log", "at pages/auth/auth.vue:143", "跳转首页失败", err);
            }
          });
          uni.showToast({ title: "登录成功", icon: "success" });
        }, 1500);
      };
      uni.getStorage({
        key: "savedPhone",
        success: (res) => {
          phoneNumber.value = res.data;
          rememberPwd.value = true;
          uni.getStorage({
            key: "savedPwd",
            success: (res2) => {
              password.value = res2.data;
            }
          });
        }
      });
      vue.onMounted(() => {
        const savedPhone = uni.getStorageSync("savedPhone");
        if (savedPhone)
          phoneNumber.value = savedPhone;
        const savedPwd = uni.getStorageSync("savedPwd");
        if (savedPwd) {
          password.value = savedPwd;
          rememberPwd.value = true;
        }
      });
      const __returned__ = { phoneNumber, password, rememberPwd, isLoading, focusInput, handleCheckboxChange, switchAuthTab, login, ref: vue.ref, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-auth" }, [
      vue.createElementVNode("view", { class: "status-bar" }),
      vue.createElementVNode("view", { class: "login-header" }, [
        vue.createElementVNode("view", { class: "avatar-box" }, [
          vue.createElementVNode("text", { class: "avatar-icon" }, "👴")
        ]),
        vue.createElementVNode("text", { class: "app-title" }, "老年伴侣"),
        vue.createElementVNode("text", { class: "app-subtitle" }, "守护每一个温暖时光"),
        vue.createElementVNode("view", { class: "tab-box" }, [
          vue.createElementVNode("button", {
            class: "tab-btn active",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.switchAuthTab("login"))
          }, "登录")
        ])
      ]),
      vue.createElementVNode("view", { class: "form-container" }, [
        vue.createElementVNode("view", { class: "input-group" }, [
          vue.createElementVNode("view", { class: "input-wrapper" }, [
            vue.createElementVNode("text", { class: "input-icon" }, "📱"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                placeholder: "请输入手机号",
                class: "form-input",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.phoneNumber = $event),
                maxlength: "11",
                focus: "true",
                onClick: $setup.focusInput
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.phoneNumber]
            ])
          ]),
          vue.createElementVNode("view", { class: "input-wrapper" }, [
            vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "password",
                placeholder: "请输入密码",
                class: "form-input",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.password = $event),
                onClick: $setup.focusInput
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.password]
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-footer" }, [
          vue.createElementVNode("label", { class: "remember-box" }, [
            vue.createElementVNode("checkbox", {
              class: "checkbox",
              color: "#2563eb",
              checked: $setup.rememberPwd,
              onChange: $setup.handleCheckboxChange
            }, null, 40, ["checked"]),
            vue.createElementVNode("text", { class: "remember-text" }, "记住密码")
          ]),
          vue.createElementVNode("navigator", {
            url: "/pages/forgetPwd/forgetPwd",
            class: "forget-text"
          }, "忘记密码？")
        ]),
        vue.createElementVNode("button", {
          class: "login-btn",
          onClick: $setup.login,
          disabled: $setup.isLoading
        }, [
          !$setup.isLoading ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "登录")) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "登录中..."))
        ], 8, ["disabled"])
      ]),
      vue.createElementVNode("view", { class: "copyright" }, [
        vue.createElementVNode("text", null, "© 2025 老年伴侣 版权所有")
      ])
    ]);
  }
  const PagesAuthAuth = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f], ["__scopeId", "data-v-98e148d1"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/auth/auth.vue"]]);
  const _sfc_main$e = {
    __name: "custom-tabbar",
    setup(__props, { expose: __expose }) {
      __expose();
      const currentPath = vue.ref("");
      const hasUnread = vue.ref(true);
      vue.onMounted(() => {
        const pages = getCurrentPages();
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          currentPath.value = `/${currentPage.route}`;
        }
      });
      const handleSwitchTab = (url) => {
        if (currentPath.value === url)
          return;
        uni.switchTab({
          url,
          fail: (err) => {
            formatAppLog("error", "at components/custom-tabbar/custom-tabbar.vue:52", "切换tab失败：", err);
            uni.redirectTo({ url });
          }
        });
      };
      const __returned__ = { currentPath, hasUnread, handleSwitchTab, ref: vue.ref, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "custom-tabbar" }, [
      vue.createElementVNode("view", { class: "tabbar-wrap" }, [
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass(["tabbar-item", { active: $setup.currentPath === "/pages/device/device" }]),
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.handleSwitchTab("/pages/device/device"))
          },
          [
            vue.createElementVNode("text", { class: "item-icon" }, "🏠"),
            vue.createElementVNode("text", { class: "item-text" }, "首页")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass(["tabbar-item", { active: $setup.currentPath === "/pages/health/health" }]),
            onClick: _cache[1] || (_cache[1] = ($event) => $setup.handleSwitchTab("/pages/health/health"))
          },
          [
            vue.createElementVNode("text", { class: "item-icon" }, "📊"),
            vue.createElementVNode("text", { class: "item-text" }, "健康")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass(["tabbar-item", { active: $setup.currentPath === "/pages/interact/interact" }]),
            onClick: _cache[2] || (_cache[2] = ($event) => $setup.handleSwitchTab("/pages/interact/interact"))
          },
          [
            vue.createElementVNode("text", { class: "item-icon" }, "👪"),
            vue.createElementVNode("text", { class: "item-text" }, "亲情")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass(["tabbar-item", { active: $setup.currentPath === "/pages/mine/mine" }]),
            onClick: _cache[3] || (_cache[3] = ($event) => $setup.handleSwitchTab("/pages/mine/mine"))
          },
          [
            vue.createElementVNode("text", { class: "item-icon" }, "👤"),
            $setup.hasUnread ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "badge"
            }, "1")) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("text", { class: "item-text" }, "我的")
          ],
          2
          /* CLASS */
        )
      ])
    ]);
  }
  const customTabbar = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__scopeId", "data-v-51c48e3c"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/components/custom-tabbar/custom-tabbar.vue"]]);
  const _imports_0$2 = "/static/images/camera-placeholder.png";
  const _sfc_main$d = {
    __name: "device",
    setup(__props, { expose: __expose }) {
      __expose();
      const updateCurrentTime = () => {
        const now = /* @__PURE__ */ new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        currentTime.value = `${hours}:${minutes}`;
      };
      const temperature = vue.ref(24.5);
      const humidity = vue.ref(48);
      const envStatusText = vue.ref("安全");
      const isVideoOnline = vue.ref(true);
      const isVideoPlaying = vue.ref(false);
      const currentTime = vue.ref("");
      const isScroll = vue.ref(false);
      const isClick = vue.ref(false);
      const scrollViewHeight = vue.ref(0);
      let dataTimer = null;
      const simulateEnvDataRefresh = () => {
        dataTimer = setInterval(() => {
          temperature.value = Number((temperature.value + (Math.random() - 0.5)).toFixed(1));
          humidity.value = Math.round(humidity.value + (Math.random() - 0.5) * 2);
          if (temperature.value > 28) {
            envStatusText.value = "高温预警";
          } else if (temperature.value < 18) {
            envStatusText.value = "低温预警";
          } else if (humidity.value > 60) {
            envStatusText.value = "高湿预警";
          } else if (humidity.value < 30) {
            envStatusText.value = "低湿预警";
          } else {
            envStatusText.value = "安全";
          }
        }, 5e3);
      };
      const onScroll = (e) => {
        isScroll.value = e.detail.scrollTop > 20;
      };
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
        formatAppLog("log", "at pages/device/device.vue:220", "跳过登录校验，方便测试");
        updateCurrentTime();
        simulateEnvDataRefresh();
        setInterval(() => {
          updateCurrentTime();
          isVideoPlaying.value = false;
        }, 6e4);
      });
      vue.onUnmounted(() => {
        if (dataTimer)
          clearInterval(dataTimer);
      });
      const showEnvironment = () => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/device/device.vue:242", "执行环境详情页跳转，路径：/pages/environment/environment");
          uni.navigateTo({
            url: "/pages/environment/environment",
            fail: (err) => {
              formatAppLog("error", "at pages/device/device.vue:246", "环境详情页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const showVideoDetail = () => {
        if (!isVideoOnline.value) {
          uni.showToast({ title: "摄像头离线，无法查看", icon: "none", duration: 2e3 });
          return;
        }
        isVideoPlaying.value = true;
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/device/device.vue:266", "执行实时画面页跳转，路径：/pages/video-detail/video-detail");
          uni.navigateTo({
            url: "/pages/video-detail/video-detail",
            fail: (err) => {
              formatAppLog("error", "at pages/device/device.vue:270", "实时画面页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const gotoLocation = () => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/device/device.vue:284", "执行位置查看页跳转，路径：/pages/location/location");
          uni.navigateTo({
            url: "/pages/location/location",
            fail: (err) => {
              formatAppLog("error", "at pages/device/device.vue:288", "位置查看页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const gotoMedicine = () => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/device/device.vue:302", "执行用药提醒页跳转，路径：/pages/medicine/medicine");
          uni.navigateTo({
            url: "/pages/medicine/medicine",
            fail: (err) => {
              formatAppLog("error", "at pages/device/device.vue:306", "用药提醒页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const gotoNotifications = () => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/device/device.vue:320", "执行报警记录页跳转，路径：/pages/notifications/notifications");
          uni.navigateTo({
            url: "/pages/notifications/notifications",
            fail: (err) => {
              formatAppLog("error", "at pages/device/device.vue:324", "报警记录页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const gotoHealth = () => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/device/device.vue:339", "切换到健康数据tabBar页，路径：/pages/health/health");
          uni.switchTab({
            url: "/pages/health/health",
            fail: (err) => {
              formatAppLog("error", "at pages/device/device.vue:343", "健康数据页切换失败：", err);
              uni.showToast({
                title: `切换失败：${err.errMsg || "页面未配置为tabBar"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const gotoInteract = () => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/device/device.vue:357", "切换到亲情互动tabBar页，路径：/pages/interact/interact");
          uni.switchTab({
            url: "/pages/interact/interact",
            fail: (err) => {
              formatAppLog("error", "at pages/device/device.vue:361", "亲情互动页切换失败：", err);
              uni.showToast({
                title: `切换失败：${err.errMsg || "页面未配置为tabBar"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const gotoSetting = () => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/device/device.vue:375", "执行设置页跳转，路径：/pages/setting/setting");
          uni.navigateTo({
            url: "/pages/setting/setting",
            fail: (err) => {
              formatAppLog("error", "at pages/device/device.vue:379", "设置页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const emergencyCall = () => {
        handleFunctionClick2(() => {
          uni.showModal({
            title: "紧急呼叫",
            content: "是否立即联系紧急联系人？",
            confirmText: "呼叫",
            cancelText: "取消",
            success: (res) => {
              if (res.confirm) {
                uni.showToast({ title: "正在呼叫紧急联系人...", icon: "none", duration: 3e3 });
              }
            }
          });
        });
      };
      const handleTakeMedicine = () => {
        handleFunctionClick2(() => {
          uni.showToast({ title: "已标记为服用", icon: "success" });
        });
      };
      const handleFunctionClick2 = (callback) => {
        isClick.value = true;
        setTimeout(() => {
          isClick.value = false;
          callback();
        }, 100);
      };
      const __returned__ = { updateCurrentTime, temperature, humidity, envStatusText, isVideoOnline, isVideoPlaying, currentTime, isScroll, isClick, scrollViewHeight, get dataTimer() {
        return dataTimer;
      }, set dataTimer(v) {
        dataTimer = v;
      }, simulateEnvDataRefresh, onScroll, showEnvironment, showVideoDetail, gotoLocation, gotoMedicine, gotoNotifications, gotoHealth, gotoInteract, gotoSetting, emergencyCall, handleTakeMedicine, handleFunctionClick: handleFunctionClick2, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_tabbar = resolveEasycom(vue.resolveDynamicComponent("custom-tabbar"), customTabbar);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-device" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["page-header", { "header-scroll": $setup.isScroll }])
        },
        [
          vue.createElementVNode("text", { class: "header-title" }, "老年守护中心"),
          vue.createElementVNode("button", {
            class: "header-btn",
            onClick: $setup.gotoSetting
          }, [
            vue.createElementVNode("text", { class: "setting-icon" }, "⚙️")
          ])
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScroll: $setup.onScroll,
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", {
            class: "env-card",
            onClick: $setup.showEnvironment
          }, [
            vue.createElementVNode("view", { class: "env-card-header" }, [
              vue.createElementVNode("view", { class: "env-card-title" }, [
                vue.createElementVNode("text", { class: "env-card-subtitle" }, "当前环境"),
                vue.createElementVNode(
                  "text",
                  { class: "env-card-main-title" },
                  "客厅 · " + vue.toDisplayString($setup.envStatusText),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["env-card-status", { "status-warning": $setup.envStatusText !== "安全" }])
                },
                vue.toDisplayString($setup.envStatusText !== "安全" ? "⚠️ " : "") + vue.toDisplayString($setup.envStatusText),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "env-card-grid" }, [
              vue.createElementVNode("view", { class: "env-card-item" }, [
                vue.createElementVNode("text", { class: "env-item-label" }, "室内温度"),
                vue.createElementVNode(
                  "text",
                  { class: "env-item-value" },
                  vue.toDisplayString($setup.temperature) + "°C",
                  1
                  /* TEXT */
                ),
                $setup.temperature > 28 ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "env-item-tip"
                }, "偏高")) : $setup.temperature < 18 ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "env-item-tip"
                }, "偏低")) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 2,
                  class: "env-item-tip",
                  style: { "display": "none" }
                }))
              ]),
              vue.createElementVNode("view", { class: "env-card-item" }, [
                vue.createElementVNode("text", { class: "env-item-label" }, "室内湿度"),
                vue.createElementVNode(
                  "text",
                  { class: "env-item-value" },
                  vue.toDisplayString($setup.humidity) + "%",
                  1
                  /* TEXT */
                ),
                $setup.humidity > 60 ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "env-item-tip"
                }, "偏湿")) : $setup.humidity < 30 ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "env-item-tip"
                }, "偏干")) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 2,
                  class: "env-item-tip",
                  style: { "display": "none" }
                }))
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "video-card" }, [
            vue.createElementVNode("view", { class: "video-card-header" }, [
              vue.createElementVNode("view", { class: "video-card-title" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["status-dot", { pulse: $setup.isVideoOnline, "dot-offline": !$setup.isVideoOnline }])
                  },
                  null,
                  2
                  /* CLASS */
                ),
                vue.createElementVNode("text", { class: "title-text" }, "实时画面")
              ]),
              vue.createElementVNode(
                "text",
                { class: "video-time" },
                vue.toDisplayString($setup.currentTime),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", {
              class: "video-container",
              onClick: $setup.showVideoDetail
            }, [
              vue.createElementVNode("image", {
                class: "video-placeholder",
                src: _imports_0$2,
                mode: "aspectFill"
              }),
              !$setup.isVideoPlaying && $setup.isVideoOnline ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "video-overlay"
              })) : vue.createCommentVNode("v-if", true),
              !$setup.isVideoPlaying && $setup.isVideoOnline ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "video-play-btn"
              }, [
                vue.createElementVNode("text", { class: "play-icon" }, "▶")
              ])) : vue.createCommentVNode("v-if", true),
              !$setup.isVideoOnline ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "video-status-tip"
              }, [
                vue.createElementVNode("text", { class: "status-tip-icon" }, "📴"),
                vue.createElementVNode("text", { class: "status-tip-text" }, "摄像头离线")
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          vue.createElementVNode("view", { class: "quick-actions" }, [
            vue.createElementVNode("text", { class: "action-title" }, "快捷操作"),
            vue.createElementVNode("view", { class: "function-grid" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["function-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoLocation
                },
                [
                  vue.createElementVNode("view", { class: "function-icon-box blue-bg" }, "📍"),
                  vue.createElementVNode("text", { class: "function-text" }, "位置查看")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["function-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoMedicine
                },
                [
                  vue.createElementVNode("view", { class: "function-icon-box green-bg" }, "💊"),
                  vue.createElementVNode("text", { class: "function-text" }, "用药提醒")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["function-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoNotifications
                },
                [
                  vue.createElementVNode("view", { class: "function-icon-box amber-bg" }, "⚠️"),
                  vue.createElementVNode("text", { class: "function-text" }, "报警记录")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["function-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.emergencyCall
                },
                [
                  vue.createElementVNode("view", { class: "function-icon-box red-bg" }, "🆘"),
                  vue.createElementVNode("text", { class: "function-text emergency-text" }, "紧急呼叫")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["function-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoHealth
                },
                [
                  vue.createElementVNode("view", { class: "function-icon-box purple-bg" }, "📊"),
                  vue.createElementVNode("text", { class: "function-text" }, "健康数据")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["function-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoInteract
                },
                [
                  vue.createElementVNode("view", { class: "function-icon-box pink-bg" }, "❤️"),
                  vue.createElementVNode("text", { class: "function-text" }, "亲情互动")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["function-item", { "item-active": $setup.isClick }]),
                  onClick: _cache[0] || (_cache[0] = (...args) => _ctx.gotoDeviceManage && _ctx.gotoDeviceManage(...args))
                },
                [
                  vue.createElementVNode("view", { class: "function-icon-box teal-bg" }, "🔧"),
                  vue.createElementVNode("text", { class: "function-text" }, "设备管理")
                ],
                2
                /* CLASS */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "health-tip-card" }, [
            vue.createElementVNode("view", { class: "health-tip-header" }, [
              vue.createElementVNode("text", { class: "health-tip-title" }, "今日健康提醒"),
              vue.createElementVNode("text", { class: "tip-count" }, "1条")
            ]),
            vue.createElementVNode("view", { class: "tip-item" }, [
              vue.createElementVNode("view", { class: "tip-icon-box" }, "💊"),
              vue.createElementVNode("view", { class: "tip-content" }, [
                vue.createElementVNode("text", { class: "tip-name" }, "降压药"),
                vue.createElementVNode("text", { class: "tip-desc" }, "今日 18:00 · 1片")
              ]),
              vue.createElementVNode("button", {
                class: "take-btn",
                onClick: $setup.handleTakeMedicine
              }, "已服用")
            ])
          ]),
          vue.createElementVNode("view", { class: "location-card mb-20" }, [
            vue.createElementVNode("view", { class: "location-header" }, [
              vue.createElementVNode("text", { class: "location-title" }, "位置与安全"),
              vue.createElementVNode("button", {
                class: "location-detail",
                onClick: $setup.gotoLocation
              }, "详情")
            ]),
            vue.createElementVNode("view", { class: "location-info" }, [
              vue.createElementVNode("view", { class: "location-row" }, [
                vue.createElementVNode("text", { class: "location-icon" }, "📍"),
                vue.createElementVNode("text", { class: "location-name" }, "当前位置"),
                vue.createElementVNode("text", { class: "safe-tag" }, "安全")
              ]),
              vue.createElementVNode("text", { class: "location-desc" }, "在家中 · 客厅"),
              vue.createElementVNode("text", { class: "update-time" }, "更新于 2分钟前")
            ])
          ])
        ],
        36
        /* STYLE, NEED_HYDRATION */
      ),
      vue.createVNode(_component_custom_tabbar)
    ]);
  }
  const PagesDeviceDevice = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__scopeId", "data-v-165c9ab9"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/device/device.vue"]]);
  const _imports_0$1 = "/static/images/chart-placeholder.png";
  const _sfc_main$c = {
    __name: "health",
    setup(__props, { expose: __expose }) {
      __expose();
      const heartRate = vue.ref(78);
      const bloodPressure = vue.ref("128/82");
      const bloodSugar = vue.ref(5.6);
      const steps = vue.ref(6542);
      const isScroll = vue.ref(false);
      const scrollViewHeight = vue.ref(0);
      const medicineList = vue.ref([
        { name: "降压药", time: "08:00", dosage: "1片", done: true },
        { name: "降糖药", time: "18:00", dosage: "1片", done: false }
      ]);
      let dataTimer = null;
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
        simulateHealthDataRefresh();
        onLoadLogic();
      });
      vue.onUnmounted(() => {
        if (dataTimer)
          clearInterval(dataTimer);
      });
      const onLoadLogic = () => {
        const isLogin = uni.getStorageSync("isLogin");
        if (!isLogin) {
          uni.redirectTo({ url: "/pages/auth/auth" });
          uni.showToast({ title: "请先登录", icon: "none" });
          return;
        }
      };
      const onShowLogic = () => {
        updateHealthData();
      };
      const simulateHealthDataRefresh = () => {
        dataTimer = setInterval(() => {
          heartRate.value = Math.floor(70 + Math.random() * 10);
          steps.value = Math.floor(6500 + Math.random() * 100);
        }, 1e4);
      };
      const updateHealthData = () => {
        bloodPressure.value = `${Math.floor(120 + Math.random() * 10)}/${Math.floor(80 + Math.random() * 5)}`;
        bloodSugar.value = Number((5 + Math.random() * 1).toFixed(1));
      };
      const onScroll = (e) => {
        isScroll.value = e.detail.scrollTop > 20;
      };
      const gotoSetting = () => {
        handleFunctionClick(() => {
          formatAppLog("log", "at pages/health/health.vue:197", "执行设置页跳转，路径：/pages/setting/setting");
          uni.navigateTo({
            url: "/pages/setting/setting",
            fail: (err) => {
              formatAppLog("error", "at pages/health/health.vue:201", "设置页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const addMedicine = () => {
        formatAppLog("log", "at pages/health/health.vue:214", "执行添加用药记录页跳转，路径：/pages/medicine/add-medicine");
        uni.navigateTo({
          url: "/pages/medicine/add-medicine",
          fail: (err) => {
            formatAppLog("error", "at pages/health/health.vue:218", "添加用药记录页跳转失败：", err);
            if (err.errMsg.includes("page not found")) {
              uni.navigateTo({
                url: "/pages/medicine/medicine",
                fail: (err2) => {
                  formatAppLog("error", "at pages/health/health.vue:224", "用药记录主页面跳转失败：", err2);
                  uni.showToast({
                    title: "用药记录页面暂未开发",
                    icon: "none",
                    duration: 2e3
                  });
                }
              });
            } else {
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          }
        });
      };
      const switchChartType = () => {
        uni.showToast({ title: "图表切换功能暂未开发", icon: "none", duration: 2e3 });
      };
      const goBack = () => {
        uni.navigateBack({ delta: 1 });
      };
      const __returned__ = { heartRate, bloodPressure, bloodSugar, steps, isScroll, scrollViewHeight, medicineList, get dataTimer() {
        return dataTimer;
      }, set dataTimer(v) {
        dataTimer = v;
      }, onLoadLogic, onShowLogic, simulateHealthDataRefresh, updateHealthData, onScroll, gotoSetting, addMedicine, switchChartType, goBack, customTabbar, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-health" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["page-header", { "header-scroll": $setup.isScroll }])
        },
        [
          vue.createElementVNode("text", { class: "header-title" }, "健康数据中心"),
          vue.createElementVNode("button", {
            class: "header-btn",
            onClick: $setup.gotoSetting
          }, [
            vue.createElementVNode("text", { class: "setting-icon" }, "⚙️")
          ])
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScroll: $setup.onScroll,
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "health-card" }, [
            vue.createElementVNode("view", { class: "health-card-header" }, [
              vue.createElementVNode("text", { class: "health-card-subtitle" }, "今日健康状态"),
              vue.createElementVNode("text", { class: "health-card-status" }, "正常")
            ]),
            vue.createElementVNode("view", { class: "health-card-grid" }, [
              vue.createElementVNode("view", { class: "health-card-item" }, [
                vue.createElementVNode("text", { class: "health-item-label" }, "心率"),
                vue.createElementVNode(
                  "text",
                  { class: "health-item-value" },
                  vue.toDisplayString($setup.heartRate) + " 次/分",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "health-item-tip" }, "正常范围：60-100")
              ]),
              vue.createElementVNode("view", { class: "health-card-item" }, [
                vue.createElementVNode("text", { class: "health-item-label" }, "血压"),
                vue.createElementVNode(
                  "text",
                  { class: "health-item-value" },
                  vue.toDisplayString($setup.bloodPressure),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "health-item-tip" }, "正常范围：<140/90")
              ]),
              vue.createElementVNode("view", { class: "health-card-item" }, [
                vue.createElementVNode("text", { class: "health-item-label" }, "血糖"),
                vue.createElementVNode(
                  "text",
                  { class: "health-item-value" },
                  vue.toDisplayString($setup.bloodSugar) + " mmol/L",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "health-item-tip" }, "空腹正常：3.9-6.1")
              ]),
              vue.createElementVNode("view", { class: "health-card-item" }, [
                vue.createElementVNode("text", { class: "health-item-label" }, "步数"),
                vue.createElementVNode(
                  "text",
                  { class: "health-item-value" },
                  vue.toDisplayString($setup.steps) + " 步",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "health-item-tip" }, "今日目标：8000")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "medicine-card" }, [
            vue.createElementVNode("view", { class: "medicine-card-header" }, [
              vue.createElementVNode("text", { class: "medicine-card-title" }, "今日用药记录"),
              vue.createElementVNode("button", {
                class: "add-medicine-btn",
                onClick: $setup.addMedicine
              }, "+ 添加")
            ]),
            vue.createElementVNode("view", { class: "medicine-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.medicineList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "medicine-item",
                    key: index
                  }, [
                    vue.createElementVNode("view", { class: "medicine-icon" }, "💊"),
                    vue.createElementVNode("view", { class: "medicine-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "medicine-name" },
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "medicine-time" },
                        vue.toDisplayString(item.time) + " · " + vue.toDisplayString(item.dosage),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["medicine-status", { "status-done": item.done }])
                      },
                      [
                        item.done ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "已服用")) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "未服用"))
                      ],
                      2
                      /* CLASS */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "chart-card" }, [
            vue.createElementVNode("view", { class: "chart-card-header" }, [
              vue.createElementVNode("text", { class: "chart-card-title" }, "心率趋势（7天）"),
              vue.createElementVNode("button", {
                class: "chart-type-btn",
                onClick: $setup.switchChartType
              }, "切换指标")
            ]),
            vue.createElementVNode("view", { class: "chart-container" }, [
              vue.createElementVNode("image", {
                class: "chart-placeholder",
                src: _imports_0$1,
                mode: "aspectFill"
              })
            ])
          ]),
          vue.createElementVNode("view", { class: "advice-card mb-20" }, [
            vue.createElementVNode("view", { class: "advice-card-header" }, [
              vue.createElementVNode("text", { class: "advice-card-title" }, "健康建议")
            ]),
            vue.createElementVNode("view", { class: "advice-list" }, [
              vue.createElementVNode("view", { class: "advice-item" }, [
                vue.createElementVNode("text", { class: "advice-icon" }, "💡"),
                vue.createElementVNode("text", { class: "advice-content" }, "今日步数未达标，建议晚饭后散步30分钟")
              ]),
              vue.createElementVNode("view", { class: "advice-item" }, [
                vue.createElementVNode("text", { class: "advice-icon" }, "💧"),
                vue.createElementVNode("text", { class: "advice-content" }, "每日饮水量建议不少于1500ml")
              ])
            ])
          ])
        ],
        36
        /* STYLE, NEED_HYDRATION */
      ),
      vue.createVNode($setup["customTabbar"])
    ]);
  }
  const PagesHealthHealth = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__scopeId", "data-v-04910d43"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/health/health.vue"]]);
  const _sfc_main$b = {
    __name: "interact",
    setup(__props, { expose: __expose }) {
      __expose();
      const greetingSent = vue.ref(false);
      const isScroll = vue.ref(false);
      const scrollViewHeight = vue.ref(0);
      const isClick = vue.ref(false);
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
        const isLogin = uni.getStorageSync("isLogin");
        if (!isLogin) {
          uni.redirectTo({ url: "/pages/auth/auth" });
          uni.showToast({ title: "请先登录", icon: "none" });
          return;
        }
      });
      const onScroll = (e) => {
        isScroll.value = e.detail.scrollTop > 20;
      };
      const showAddContact = () => {
        uni.showToast({ title: "新增联系人功能待开发", icon: "none" });
      };
      const makeVoiceCall = () => {
        uni.showToast({ title: "正在拨打王奶奶的语音通话...", icon: "none" });
      };
      const makeVideoCall = () => {
        uni.showToast({ title: "正在拨打王奶奶的视频通话...", icon: "none" });
      };
      const viewEmergencyDetail = () => {
        uni.showModal({
          title: "紧急提醒",
          content: "⚠️ 检测到王奶奶于客厅摔倒，请立即确认情况并联系紧急联系人！",
          confirmText: "联系家人",
          cancelText: "查看监控",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({ title: "正在联系紧急联系人...", icon: "none" });
            } else {
              uni.showToast({ title: "正在打开客厅监控...", icon: "none" });
            }
          }
        });
      };
      const confirmEmergencyRead = () => {
        uni.showToast({ title: "已确认摔倒通知，将持续关注老人状态", icon: "success" });
      };
      const previewPhoto = (id) => {
        uni.showToast({ title: `预览照片 ${id}`, icon: "none" });
      };
      const showAlbumUpload = () => {
        uni.showToast({ title: "上传照片功能待开发", icon: "none" });
      };
      const publishTask = () => {
        uni.showToast({ title: "发布新任务功能待开发", icon: "none" });
      };
      const viewTaskDetail = (id) => {
        const taskNames = ["晨间散步", "喝水8杯", "阅读养生文章"];
        uni.showToast({ title: `查看【${taskNames[id - 1]}】任务详情`, icon: "none" });
      };
      const sendGreeting = () => {
        greetingSent.value = true;
        setTimeout(() => {
          greetingSent.value = false;
        }, 2e3);
      };
      const showLeaveMessage = () => {
        uni.showToast({ title: "亲情留言功能待开发", icon: "none" });
      };
      const handleFunctionClick2 = (callback) => {
        isClick.value = true;
        setTimeout(() => {
          isClick.value = false;
          callback();
        }, 100);
      };
      const showMoreActivity = () => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/interact/interact.vue:307", "执行社区活动页跳转，路径：/pages/community/community");
          uni.navigateTo({
            // 核心：填写社区活动页的实际路径（需和pages.json中注册的路径完全一致）
            url: "/pages/community/community",
            // 跳转失败的异常处理，排查问题更方便
            fail: (err) => {
              formatAppLog("error", "at pages/interact/interact.vue:313", "社区活动页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const showActivityDetail = () => {
        uni.showToast({ title: "社区活动详情待开发", icon: "none" });
      };
      const noop = () => {
      };
      const __returned__ = { greetingSent, isScroll, scrollViewHeight, isClick, onScroll, showAddContact, makeVoiceCall, makeVideoCall, viewEmergencyDetail, confirmEmergencyRead, previewPhoto, showAlbumUpload, publishTask, viewTaskDetail, sendGreeting, showLeaveMessage, handleFunctionClick: handleFunctionClick2, showMoreActivity, showActivityDetail, noop, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted, customTabbar };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-interact" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["page-header", { "header-scroll": $setup.isScroll }])
        },
        [
          vue.createElementVNode("text", { class: "header-title" }, "亲情互动"),
          vue.createElementVNode("button", {
            class: "header-btn",
            onClick: $setup.showAddContact
          }, [
            vue.createElementVNode("text", { class: "setting-icon" }, "➕")
          ])
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScroll: $setup.onScroll,
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", {
            class: "contact-card",
            onClick: $setup.noop
          }, [
            vue.createElementVNode("view", { class: "contact-header" }, [
              vue.createElementVNode("view", { class: "contact-info" }, [
                vue.createElementVNode("text", { class: "contact-subtitle" }, "快捷联系"),
                vue.createElementVNode("text", { class: "contact-name" }, "王奶奶")
              ]),
              vue.createElementVNode("view", { class: "avatar" }, [
                vue.createElementVNode("text", { class: "avatar-text" }, "王")
              ])
            ]),
            vue.createElementVNode("view", { class: "contact-btns" }, [
              vue.createElementVNode("button", {
                class: "contact-btn",
                onClick: $setup.makeVoiceCall
              }, [
                vue.createElementVNode("text", { class: "btn-icon" }, "📞"),
                vue.createElementVNode("text", { class: "btn-text" }, "语音通话")
              ]),
              vue.createElementVNode("button", {
                class: "contact-btn",
                onClick: $setup.makeVideoCall
              }, [
                vue.createElementVNode("text", { class: "btn-icon" }, "📹"),
                vue.createElementVNode("text", { class: "btn-text" }, "视频通话")
              ])
            ])
          ]),
          vue.createElementVNode("view", {
            class: "emergency-bar",
            onClick: $setup.viewEmergencyDetail
          }, [
            vue.createElementVNode("view", { class: "emergency-left" }, [
              vue.createElementVNode("text", { class: "emergency-icon" }, "🚨"),
              vue.createElementVNode("view", { class: "emergency-info" }, [
                vue.createElementVNode("text", { class: "emergency-title" }, "紧急通知"),
                vue.createElementVNode("text", { class: "emergency-desc" }, "检测到老人摔倒 · 位置：客厅")
              ])
            ]),
            vue.createElementVNode("text", { class: "emergency-time" }, "1分钟前"),
            vue.createElementVNode("button", {
              class: "confirm-btn",
              onClick: vue.withModifiers($setup.confirmEmergencyRead, ["stop"])
            }, "已确认")
          ]),
          vue.createElementVNode("view", { class: "album-card" }, [
            vue.createElementVNode("view", { class: "album-header" }, [
              vue.createElementVNode("text", { class: "album-title" }, "家庭相册"),
              vue.createElementVNode("button", {
                class: "album-upload",
                onClick: $setup.showAlbumUpload
              }, "上传")
            ]),
            vue.createElementVNode("view", { class: "album-grid" }, [
              vue.createElementVNode("view", {
                class: "album-item",
                onClick: _cache[0] || (_cache[0] = ($event) => $setup.previewPhoto(1))
              }, [
                vue.createElementVNode("view", { class: "photo-placeholder" }, [
                  vue.createElementVNode("text", { class: "photo-icon" }, "🖼️")
                ])
              ]),
              vue.createElementVNode("view", {
                class: "album-item",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.previewPhoto(2))
              }, [
                vue.createElementVNode("view", { class: "photo-placeholder" }, [
                  vue.createElementVNode("text", { class: "photo-icon" }, "🖼️")
                ])
              ]),
              vue.createElementVNode("view", {
                class: "album-add",
                onClick: $setup.showAlbumUpload
              }, [
                vue.createElementVNode("text", { class: "add-icon" }, "➕")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "task-card" }, [
            vue.createElementVNode("view", { class: "task-header" }, [
              vue.createElementVNode("text", { class: "task-title" }, "今日任务"),
              vue.createElementVNode("button", {
                class: "task-publish",
                onClick: $setup.publishTask
              }, "发布")
            ]),
            vue.createElementVNode("view", { class: "task-list" }, [
              vue.createElementVNode("view", {
                class: "task-item",
                onClick: _cache[2] || (_cache[2] = ($event) => $setup.viewTaskDetail(1))
              }, [
                vue.createElementVNode("view", { class: "task-left" }, [
                  vue.createElementVNode("view", { class: "task-icon completed" }, "✓"),
                  vue.createElementVNode("view", { class: "task-info" }, [
                    vue.createElementVNode("text", { class: "task-name" }, "晨间散步"),
                    vue.createElementVNode("text", { class: "task-status" }, "已完成 · 获得10积分")
                  ])
                ]),
                vue.createElementVNode("text", { class: "task-reward" }, "🎉")
              ]),
              vue.createElementVNode("view", {
                class: "task-item",
                onClick: _cache[3] || (_cache[3] = ($event) => $setup.viewTaskDetail(2))
              }, [
                vue.createElementVNode("view", { class: "task-left" }, [
                  vue.createElementVNode("view", { class: "task-icon ongoing" }, "💧"),
                  vue.createElementVNode("view", { class: "task-info" }, [
                    vue.createElementVNode("text", { class: "task-name" }, "喝水8杯"),
                    vue.createElementVNode("text", { class: "task-status" }, "进行中 · 5/8杯")
                  ])
                ]),
                vue.createElementVNode("view", { class: "progress-bar" }, [
                  vue.createElementVNode("view", {
                    class: "progress-fill",
                    style: { "width": "62.5%" }
                  })
                ])
              ]),
              vue.createElementVNode("view", {
                class: "task-item",
                onClick: _cache[4] || (_cache[4] = ($event) => $setup.viewTaskDetail(3))
              }, [
                vue.createElementVNode("view", { class: "task-left" }, [
                  vue.createElementVNode("view", { class: "task-icon pending" }, "📖"),
                  vue.createElementVNode("view", { class: "task-info" }, [
                    vue.createElementVNode("text", { class: "task-name" }, "阅读养生文章"),
                    vue.createElementVNode("text", { class: "task-status" }, "未开始 · 预计15分钟")
                  ])
                ]),
                vue.createElementVNode("view", { class: "progress-bar" }, [
                  vue.createElementVNode("view", {
                    class: "progress-fill",
                    style: { "width": "0%" }
                  })
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "greeting-card" }, [
            vue.createElementVNode("text", { class: "greeting-title" }, "每日问候"),
            vue.createElementVNode("view", { class: "greeting-content" }, [
              vue.createElementVNode("text", { class: "greeting-icon" }, "☀️"),
              vue.createElementVNode("view", { class: "greeting-text" }, [
                vue.createElementVNode("text", { class: "greeting-main" }, "早安，妈妈！"),
                vue.createElementVNode("text", { class: "greeting-desc" }, "今天天气晴朗，温度适宜，适合外出散步"),
                vue.createElementVNode("button", {
                  class: "send-btn",
                  onClick: $setup.sendGreeting
                }, "发送问候"),
                vue.withDirectives(vue.createElementVNode(
                  "text",
                  { class: "send-status" },
                  "✅ 问候已发送",
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, $setup.greetingSent]
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "message-card" }, [
            vue.createElementVNode("view", { class: "message-header" }, [
              vue.createElementVNode("text", { class: "message-title" }, "亲情留言"),
              vue.createElementVNode("button", {
                class: "message-leave",
                onClick: $setup.showLeaveMessage
              }, "留言")
            ]),
            vue.createElementVNode("view", { class: "message-list" }, [
              vue.createElementVNode("view", { class: "message-item from-daughter" }, [
                vue.createElementVNode("view", { class: "msg-header" }, [
                  vue.createElementVNode("text", { class: "sender" }, "女儿 - 昨天 19:30"),
                  vue.createElementVNode("text", { class: "read-status" }, "已读")
                ]),
                vue.createElementVNode("text", { class: "message-content" }, "妈妈，明天我带外孙来看您，记得别出门买菜啦～")
              ]),
              vue.createElementVNode("view", { class: "message-item from-grandma" }, [
                vue.createElementVNode("view", { class: "msg-header" }, [
                  vue.createElementVNode("text", { class: "sender" }, "王奶奶 - 昨天 20:05"),
                  vue.createElementVNode("text", { class: "read-status" }, "已读")
                ]),
                vue.createElementVNode("text", { class: "message-content" }, "好的好的，我准备点你们爱吃的饺子馅～")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "activity-card mb-20" }, [
            vue.createElementVNode("view", { class: "activity-header" }, [
              vue.createElementVNode("text", { class: "activity-title" }, "社区活动"),
              vue.createElementVNode("button", {
                class: "activity-more",
                onClick: $setup.showMoreActivity
              }, "更多")
            ]),
            vue.createElementVNode("view", { class: "activity-list" }, [
              vue.createElementVNode("view", {
                class: "activity-item",
                onClick: $setup.showActivityDetail
              }, [
                vue.createElementVNode("view", { class: "activity-icon" }, "🎵"),
                vue.createElementVNode("view", { class: "activity-info" }, [
                  vue.createElementVNode("text", { class: "activity-name" }, "社区合唱团"),
                  vue.createElementVNode("text", { class: "activity-desc" }, "每周三下午 2:00 | 社区活动中心2楼"),
                  vue.createElementVNode("button", { class: "join-btn" }, "报名参加")
                ])
              ]),
              vue.createElementVNode("view", {
                class: "activity-item",
                onClick: $setup.showActivityDetail
              }, [
                vue.createElementVNode("view", { class: "activity-icon" }, "♟️"),
                vue.createElementVNode("view", { class: "activity-info" }, [
                  vue.createElementVNode("text", { class: "activity-name" }, "棋牌友谊赛"),
                  vue.createElementVNode("text", { class: "activity-desc" }, "本周六上午 9:00 | 社区老年活动室"),
                  vue.createElementVNode("button", { class: "join-btn" }, "报名参加")
                ])
              ])
            ])
          ])
        ],
        36
        /* STYLE, NEED_HYDRATION */
      ),
      vue.createVNode($setup["customTabbar"])
    ]);
  }
  const PagesInteractInteract = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-00fc7d81"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/interact/interact.vue"]]);
  const _sfc_main$a = {
    __name: "notifications",
    setup(__props, { expose: __expose }) {
      __expose();
      const currentFilter = vue.ref("all");
      const scrollViewHeight = vue.ref(0);
      const notifications = vue.ref([
        {
          id: 1,
          type: "fall",
          // 跌倒/烟雾/温度/湿度/紧急呼叫
          typeText: "老人跌倒",
          title: "老人跌倒预警",
          desc: "检测到老人在客厅区域发生跌倒，请注意查看并确认安全",
          time: 17356896e5,
          // 时间戳
          location: "家中 · 客厅",
          status: "unhandled"
          // unhandled/handled
        },
        {
          id: 2,
          type: "smoke",
          typeText: "烟雾报警",
          desc: "厨房区域检测到烟雾浓度超标，可能存在火灾风险",
          time: 17356752e5,
          location: "家中 · 厨房",
          status: "handled",
          handleTime: 17356758e5
        },
        {
          id: 3,
          type: "temperature",
          typeText: "高温预警",
          desc: "室内温度达到32°C，超过安全阈值，请及时采取降温措施",
          time: 17356608e5,
          location: "家中 · 卧室",
          status: "handled",
          handleTime: 17356614e5
        },
        {
          id: 4,
          type: "emergency",
          typeText: "紧急呼叫",
          desc: "老人触发了紧急呼叫按钮，需要立即联系确认情况",
          time: 17356464e5,
          location: "家中 · 卫生间",
          status: "unhandled"
        },
        {
          id: 5,
          type: "humidity",
          typeText: "高湿预警",
          desc: "室内湿度达到75%，容易滋生霉菌，建议开启除湿设备",
          time: 1735632e6,
          location: "家中 · 阳台",
          status: "handled",
          handleTime: 17356326e5
        }
      ]);
      const filteredNotifications = vue.computed(() => {
        if (currentFilter.value === "all") {
          return notifications.value;
        } else if (currentFilter.value === "unhandled") {
          return notifications.value.filter((item) => item.status === "unhandled");
        } else {
          return notifications.value.filter((item) => item.status === "handled");
        }
      });
      const unhandledCount = vue.computed(() => {
        return notifications.value.filter((item) => item.status === "unhandled").length;
      });
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const filterBarH = 80 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - filterBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
      });
      const changeFilter = (filterType) => {
        currentFilter.value = filterType;
      };
      const goBack = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      const getIconClass = (type) => {
        switch (type) {
          case "fall":
            return "icon-fall";
          case "smoke":
            return "icon-smoke";
          case "temperature":
            return "icon-temperature";
          case "humidity":
            return "icon-humidity";
          case "emergency":
            return "icon-emergency";
          default:
            return "icon-default";
        }
      };
      const getIconText = (type) => {
        switch (type) {
          case "fall":
            return "🚨";
          case "smoke":
            return "🔥";
          case "temperature":
            return "🌡️";
          case "humidity":
            return "💧";
          case "emergency":
            return "🆘";
          default:
            return "⚠️";
        }
      };
      const formatTime = (timestamp, showDate = false) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        if (showDate) {
          return `${year}-${month}-${day} ${hours}:${minutes}`;
        } else {
          const now = (/* @__PURE__ */ new Date()).getTime();
          const diff = Math.floor((now - timestamp) / 1e3);
          if (diff < 60) {
            return "刚刚";
          } else if (diff < 3600) {
            return `${Math.floor(diff / 60)}分钟前`;
          } else if (diff < 86400) {
            return `${Math.floor(diff / 3600)}小时前`;
          } else {
            return `${month}-${day} ${hours}:${minutes}`;
          }
        }
      };
      const viewDetail = (item) => {
        const detailText = `
报警类型：${item.typeText}
报警时间：${formatTime(item.time, true)}
报警位置：${item.location}
报警描述：${item.desc}
报警状态：${item.status === "unhandled" ? "未处理" : "已处理"}${item.handleTime ? "\n处理时间：" + formatTime(item.handleTime, true) : ""}
  `;
        uni.showModal({
          title: "报警详情",
          content: detailText.trim(),
          showCancel: item.status === "unhandled",
          cancelText: "取消",
          confirmText: item.status === "unhandled" ? "确认处理" : "知道了",
          success: (res) => {
            if (res.confirm && item.status === "unhandled") {
              const index = notifications.value.findIndex((i) => i.id === item.id);
              if (index !== -1) {
                notifications.value[index].status = "handled";
                notifications.value[index].handleTime = (/* @__PURE__ */ new Date()).getTime();
                uni.showToast({
                  title: "已标记为处理",
                  icon: "success",
                  duration: 2e3
                });
              }
            }
          }
        });
      };
      const handleNotification = (index) => {
        uni.showModal({
          title: "确认处理",
          content: "是否确认已处理该报警？",
          confirmText: "确认",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              notifications.value[index].status = "handled";
              notifications.value[index].handleTime = (/* @__PURE__ */ new Date()).getTime();
              uni.showToast({
                title: "已标记为处理",
                icon: "success",
                duration: 2e3
              });
            }
          }
        });
      };
      const __returned__ = { currentFilter, scrollViewHeight, notifications, filteredNotifications, unhandledCount, changeFilter, goBack, getIconClass, getIconText, formatTime, viewDetail, handleNotification, ref: vue.ref, onMounted: vue.onMounted, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-notifications" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("button", {
          class: "back-btn",
          onClick: $setup.goBack
        }, [
          vue.createElementVNode("text", { class: "back-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "header-title" }, "报警记录"),
        vue.createElementVNode("view", { class: "empty-btn" })
      ]),
      vue.createElementVNode("view", { class: "filter-bar" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["filter-item", { active: $setup.currentFilter === "all" }]),
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.changeFilter("all"))
          },
          [
            vue.createElementVNode("text", { class: "filter-text" }, "全部")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["filter-item", { active: $setup.currentFilter === "unhandled" }]),
            onClick: _cache[1] || (_cache[1] = ($event) => $setup.changeFilter("unhandled"))
          },
          [
            vue.createElementVNode("text", { class: "filter-text" }, "未处理"),
            $setup.unhandledCount > 0 ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "badge"
              },
              vue.toDisplayString($setup.unhandledCount),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["filter-item", { active: $setup.currentFilter === "handled" }]),
            onClick: _cache[2] || (_cache[2] = ($event) => $setup.changeFilter("handled"))
          },
          [
            vue.createElementVNode("text", { class: "filter-text" }, "已处理")
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "notifications-list",
          "scroll-y": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          $setup.filteredNotifications.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-tip"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "📭"),
            vue.createElementVNode(
              "text",
              { class: "empty-text" },
              "暂无" + vue.toDisplayString($setup.currentFilter === "all" ? "" : $setup.currentFilter === "unhandled" ? "未处理" : "已处理") + "报警记录",
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "empty-desc" }, "所有报警信息都会在这里展示")
          ])) : vue.createCommentVNode("v-if", true),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.filteredNotifications, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "notification-item",
                key: index,
                onClick: ($event) => $setup.viewDetail(item)
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["notification-icon", $setup.getIconClass(item.type)])
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "icon-text" },
                      vue.toDisplayString($setup.getIconText(item.type)),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode("view", { class: "notification-content" }, [
                  vue.createElementVNode("view", { class: "content-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "notification-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["notification-status", item.status === "unhandled" ? "status-unhandled" : "status-handled"])
                      },
                      vue.toDisplayString(item.status === "unhandled" ? "未处理" : "已处理"),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "notification-desc" },
                    vue.toDisplayString(item.desc),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "content-footer" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "notification-time" },
                      vue.toDisplayString($setup.formatTime(item.time)),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "notification-location" },
                      vue.toDisplayString(item.location),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                item.status === "unhandled" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "notification-actions"
                }, [
                  vue.createElementVNode("button", {
                    class: "handle-btn",
                    onClick: vue.withModifiers(($event) => $setup.handleNotification(index), ["stop"])
                  }, [
                    vue.createElementVNode("text", { class: "handle-text" }, "处理")
                  ], 8, ["onClick"])
                ])) : vue.createCommentVNode("v-if", true)
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesNotificationsNotifications = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-e30a2353"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/notifications/notifications.vue"]]);
  const _sfc_main$9 = {
    __name: "mine",
    setup(__props, { expose: __expose }) {
      __expose();
      const userName = vue.ref("李先生");
      const relation = vue.ref("长子");
      const bindUser = vue.ref("王奶奶");
      const bindRelation = vue.ref("母亲");
      const heartRate = vue.ref(78);
      const battery = vue.ref(85);
      const alarmCount = vue.ref(5);
      const fallDetection = vue.ref(true);
      const scrollViewHeight = vue.ref(0);
      const isScroll = vue.ref(false);
      onLoad(() => {
        formatAppLog("log", "at pages/mine/mine.vue:200", "我的页面已加载");
        initUserData();
      });
      onShow(() => {
        updateDeviceStatus();
      });
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
          if (scrollViewHeight.value <= 0) {
            scrollViewHeight.value = 500;
          }
        } catch (e) {
          formatAppLog("error", "at pages/mine/mine.vue:223", "计算滚动高度失败:", e);
          scrollViewHeight.value = 500;
        }
        const isLogin = uni.getStorageSync("isLogin");
        if (!isLogin) {
          uni.redirectTo({ url: "/pages/auth/auth" });
          uni.showToast({ title: "请先登录", icon: "none" });
          return;
        }
      });
      const initUserData = () => {
        const userInfo = uni.getStorageSync("userInfo");
        if (userInfo) {
          userName.value = userInfo.name || userName.value;
          relation.value = userInfo.relation || relation.value;
          bindUser.value = userInfo.bindUser || bindUser.value;
          bindRelation.value = userInfo.bindRelation || bindRelation.value;
        }
        setTimeout(() => {
          heartRate.value = Math.floor(Math.random() * 20) + 60;
          battery.value = Math.floor(Math.random() * 50) + 50;
        }, 500);
      };
      const updateDeviceStatus = () => {
        setTimeout(() => {
          heartRate.value = Math.floor(Math.random() * 10) + 70;
        }, 1e3);
      };
      const editProfile = () => {
        uni.navigateTo({
          url: "/pages/profile/profile",
          fail: () => {
            uni.showToast({
              title: "个人资料页开发中",
              icon: "none",
              duration: 1500
            });
          }
        });
      };
      const showSettings = () => {
        uni.navigateTo({
          url: "/pages/setting/setting",
          fail: () => {
            uni.showToast({
              title: "设置页开发中",
              icon: "none"
            });
          }
        });
      };
      const showDeviceDetail = () => {
        uni.navigateTo({
          url: "/pages/device-manage/device-manage",
          fail: () => {
            uni.showToast({
              title: "设备详情页开发中",
              icon: "none"
            });
          }
        });
      };
      const showCamera = () => {
        uni.navigateTo({
          url: "/pages/device/camera",
          fail: () => {
            uni.showToast({
              title: "摄像头页面开发中",
              icon: "none"
            });
          }
        });
      };
      const showNotifications = () => {
        uni.navigateTo({
          url: "/pages/notification/record",
          fail: () => {
            uni.showToast({
              title: "报警记录页开发中",
              icon: "none"
            });
          }
        });
      };
      const onFallDetectionChange = (e) => {
        fallDetection.value = e.detail.value;
        uni.showToast({
          title: fallDetection.value ? "跌倒检测已开启" : "跌倒检测已关闭",
          icon: "none"
        });
        uni.setStorageSync("fallDetection", fallDetection.value);
      };
      const showOtherSafety = () => {
        uni.navigateTo({
          url: "/pages/safety/other",
          fail: () => {
            uni.showToast({
              title: "安全设置页开发中",
              icon: "none"
            });
          }
        });
      };
      const showFamily = () => {
        uni.navigateTo({
          url: "/pages/family/manage",
          fail: () => {
            uni.showToast({
              title: "家庭成员页开发中",
              icon: "none"
            });
          }
        });
      };
      const showEmergency = () => {
        uni.navigateTo({
          url: "/pages/contact/emergency",
          fail: () => {
            uni.showToast({
              title: "紧急联系人页开发中",
              icon: "none"
            });
          }
        });
      };
      const logout = () => {
        uni.showModal({
          title: "退出登录",
          content: "确定要退出当前账号吗？退出后将无法查看监护信息和设备数据。",
          confirmText: "退出",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("isLogin");
              uni.removeStorageSync("userInfo");
              uni.redirectTo({
                url: "/pages/auth/auth"
              });
              uni.showToast({
                title: "退出成功",
                icon: "success",
                duration: 1500
              });
            }
          }
        });
      };
      const onScroll = (e) => {
        isScroll.value = e.detail.scrollTop > 20;
      };
      const __returned__ = { userName, relation, bindUser, bindRelation, heartRate, battery, alarmCount, fallDetection, scrollViewHeight, isScroll, initUserData, updateDeviceStatus, editProfile, showSettings, showDeviceDetail, showCamera, showNotifications, onFallDetectionChange, showOtherSafety, showFamily, showEmergency, logout, onScroll, ref: vue.ref, onMounted: vue.onMounted, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, customTabbar };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-mine" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["page-header", { "header-scroll": $setup.isScroll }])
        },
        [
          vue.createElementVNode("text", { class: "header-title" }, "我的"),
          vue.createElementVNode("button", {
            class: "header-btn",
            onClick: $setup.showSettings
          }, [
            vue.createElementVNode("text", { class: "setting-icon" }, "⚙️")
          ])
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScroll: $setup.onScroll,
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "section-spacing" }, [
            vue.createElementVNode("view", {
              class: "user-card card-hover",
              onClick: $setup.editProfile
            }, [
              vue.createElementVNode("view", { class: "user-info-wrap" }, [
                vue.createElementVNode("view", { class: "avatar-box" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "avatar-text" },
                    vue.toDisplayString($setup.userName && $setup.userName.charAt(0) || "李"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "user-detail" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "user-name" },
                    vue.toDisplayString($setup.userName || "李先生") + " (" + vue.toDisplayString($setup.relation || "长子") + ")",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "bind-info" },
                    "当前绑定：" + vue.toDisplayString($setup.bindUser || "王奶奶") + " (" + vue.toDisplayString($setup.bindRelation || "母亲") + ")",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "online-status" }, [
                    vue.createElementVNode("view", { class: "status-dot" }),
                    vue.createElementVNode("text", { class: "status-text" }, "在线监护中")
                  ])
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "section-spacing" }, [
            vue.createElementVNode("view", { class: "module-card card-hover" }, [
              vue.createElementVNode("view", { class: "module-header" }, [
                vue.createElementVNode("text", { class: "module-title" }, "设备管理")
              ]),
              vue.createElementVNode("view", { class: "module-content divide-y" }, [
                vue.createElementVNode("button", {
                  class: "device-item",
                  onClick: $setup.showDeviceDetail
                }, [
                  vue.createElementVNode("view", { class: "device-left" }, [
                    vue.createElementVNode("view", { class: "device-icon orange" }, [
                      vue.createElementVNode("text", { class: "device-icon-text" }, "⌚")
                    ]),
                    vue.createElementVNode("view", { class: "device-info" }, [
                      vue.createElementVNode("text", { class: "device-name" }, "智能手环"),
                      vue.createElementVNode(
                        "text",
                        { class: "device-status" },
                        "心率: " + vue.toDisplayString($setup.heartRate) + "bpm · 电量: " + vue.toDisplayString($setup.battery) + "%",
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("text", { class: "arrow-icon" }, "→")
                ]),
                vue.createElementVNode("button", {
                  class: "device-item",
                  onClick: $setup.showCamera
                }, [
                  vue.createElementVNode("view", { class: "device-left" }, [
                    vue.createElementVNode("view", { class: "device-icon blue" }, [
                      vue.createElementVNode("text", { class: "device-icon-text" }, "📹")
                    ]),
                    vue.createElementVNode("view", { class: "device-info" }, [
                      vue.createElementVNode("text", { class: "device-name" }, "监控摄像头"),
                      vue.createElementVNode("text", { class: "device-status" }, "客厅 · 在线")
                    ])
                  ]),
                  vue.createElementVNode("text", { class: "arrow-icon" }, "→")
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "section-spacing" }, [
            vue.createElementVNode("view", { class: "module-card card-hover" }, [
              vue.createElementVNode("view", { class: "module-header" }, [
                vue.createElementVNode("text", { class: "module-title" }, "安全与提醒")
              ]),
              vue.createElementVNode("view", { class: "module-content divide-y" }, [
                vue.createElementVNode("button", {
                  class: "safety-item",
                  onClick: $setup.showNotifications
                }, [
                  vue.createElementVNode("view", { class: "safety-left" }, [
                    vue.createElementVNode("view", { class: "safety-icon red" }, [
                      vue.createElementVNode("text", { class: "safety-icon-text" }, "🔔")
                    ]),
                    vue.createElementVNode("text", { class: "safety-text" }, "报警记录")
                  ]),
                  vue.createElementVNode("view", { class: "safety-right" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "badge" },
                      vue.toDisplayString($setup.alarmCount),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", { class: "arrow-icon" }, "→")
                  ])
                ]),
                vue.createElementVNode("view", { class: "safety-item" }, [
                  vue.createElementVNode("view", { class: "safety-left" }, [
                    vue.createElementVNode("view", { class: "safety-icon orange" }, [
                      vue.createElementVNode("text", { class: "safety-icon-text" }, "⚠️")
                    ]),
                    vue.createElementVNode("view", { class: "fall-info" }, [
                      vue.createElementVNode("text", { class: "safety-text" }, "跌倒检测"),
                      vue.createElementVNode("text", { class: "fall-status" }, "运行中")
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "switch-wrap" }, [
                    vue.createElementVNode("switch", {
                      checked: $setup.fallDetection,
                      color: "#22c55e",
                      onChange: $setup.onFallDetectionChange
                    }, null, 40, ["checked"])
                  ])
                ]),
                vue.createElementVNode("button", {
                  class: "safety-item",
                  onClick: $setup.showOtherSafety
                }, [
                  vue.createElementVNode("view", { class: "safety-left" }, [
                    vue.createElementVNode("view", { class: "safety-icon blue" }, [
                      vue.createElementVNode("text", { class: "safety-icon-text" }, "🛡️")
                    ]),
                    vue.createElementVNode("text", { class: "safety-text" }, "其他安全设置")
                  ]),
                  vue.createElementVNode("text", { class: "arrow-icon" }, "→")
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "section-spacing" }, [
            vue.createElementVNode("view", { class: "module-card card-hover" }, [
              vue.createElementVNode("view", { class: "module-header" }, [
                vue.createElementVNode("text", { class: "module-title" }, "家庭管理")
              ]),
              vue.createElementVNode("view", { class: "module-content divide-y" }, [
                vue.createElementVNode("button", {
                  class: "family-item",
                  onClick: $setup.showFamily
                }, [
                  vue.createElementVNode("view", { class: "family-left" }, [
                    vue.createElementVNode("view", { class: "family-icon indigo" }, [
                      vue.createElementVNode("text", { class: "family-icon-text" }, "👨‍👩‍👧")
                    ]),
                    vue.createElementVNode("text", { class: "family-text" }, "家庭成员管理")
                  ]),
                  vue.createElementVNode("text", { class: "arrow-icon" }, "→")
                ]),
                vue.createElementVNode("button", {
                  class: "family-item",
                  onClick: $setup.showEmergency
                }, [
                  vue.createElementVNode("view", { class: "family-left" }, [
                    vue.createElementVNode("view", { class: "family-icon orange" }, [
                      vue.createElementVNode("text", { class: "family-icon-text" }, "📞")
                    ]),
                    vue.createElementVNode("text", { class: "family-text" }, "紧急联系人设置")
                  ]),
                  vue.createElementVNode("text", { class: "arrow-icon" }, "→")
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "section-spacing" }, [
            vue.createElementVNode("button", {
              class: "logout-btn",
              onClick: $setup.logout
            }, [
              vue.createElementVNode("text", { class: "logout-icon" }, "🚪"),
              vue.createElementVNode("text", { class: "logout-text" }, "退出登录")
            ])
          ]),
          vue.createElementVNode("view", { class: "bottom-space" })
        ],
        36
        /* STYLE, NEED_HYDRATION */
      ),
      vue.createVNode($setup["customTabbar"])
    ]);
  }
  const PagesMineMine = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-7c2ebfa5"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/mine/mine.vue"]]);
  const _imports_0 = "/static/images/map-placeholder.png";
  const _sfc_main$8 = {
    __name: "location",
    setup(__props, { expose: __expose }) {
      __expose();
      const isScroll = vue.ref(false);
      const isClick = vue.ref(false);
      const scrollViewHeight = vue.ref(0);
      const isLocationNormal = vue.ref(true);
      const isMapLoading = vue.ref(true);
      const historyList = vue.ref([
        // 位置历史数据（结构清晰，适配样式）
        {
          icon: "📍",
          iconBg: "purple-bg",
          place: "在家中",
          time: "今天 06:30 - 至今"
        },
        {
          icon: "🌳",
          iconBg: "green-bg",
          place: "公园散步",
          time: "今天 05:00 - 06:20"
        }
      ]);
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
        setTimeout(() => {
          isMapLoading.value = false;
          formatAppLog("log", "at pages/location/location.vue:144", "地图加载完成");
        }, 2e3);
      });
      vue.onUnmounted(() => {
      });
      const onScroll = (e) => {
        isScroll.value = e.detail.scrollTop > 20;
      };
      const handleFunctionClick2 = (callback) => {
        isClick.value = true;
        setTimeout(() => {
          isClick.value = false;
          callback();
        }, 100);
      };
      const closeLocation = () => {
        handleFunctionClick2(() => {
          uni.navigateBack({ delta: 1 });
        });
      };
      const gotoMapFull = () => {
        if (isMapLoading.value) {
          uni.showToast({ title: "地图加载中，请稍候", icon: "none" });
          return;
        }
        handleFunctionClick2(() => {
          uni.showToast({ title: "地图全屏功能开发中", icon: "none", duration: 2e3 });
        });
      };
      const gotoNav = () => {
        handleFunctionClick2(() => {
          uni.showModal({
            title: "地图导航",
            content: "是否打开原生地图进行导航？",
            confirmText: "确认",
            cancelText: "取消",
            success: (res) => {
              if (res.confirm) {
                uni.openLocation({
                  latitude: 39.9042,
                  // 示例纬度，后续替换为实际定位纬度
                  longitude: 116.4074,
                  // 示例经度，后续替换为实际定位经度
                  address: "XX市XX区XX街道XX号XX小区3栋2单元501",
                  name: "当前位置",
                  fail: (err) => {
                    formatAppLog("error", "at pages/location/location.vue:202", "导航失败：", err);
                    uni.showToast({ title: "导航功能暂不支持", icon: "none" });
                  }
                });
              }
            }
          });
        });
      };
      const __returned__ = { isScroll, isClick, scrollViewHeight, isLocationNormal, isMapLoading, historyList, onScroll, handleFunctionClick: handleFunctionClick2, closeLocation, gotoMapFull, gotoNav, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-location" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["page-header", { "header-scroll": $setup.isScroll }])
        },
        [
          vue.createElementVNode("button", {
            class: "header-btn back-btn",
            onClick: $setup.closeLocation
          }, [
            vue.createElementVNode("text", { class: "back-icon" }, "←")
          ]),
          vue.createElementVNode("text", { class: "header-title" }, "位置详情"),
          vue.createElementVNode("button", {
            class: "header-btn nav-btn",
            onClick: $setup.gotoNav
          }, [
            vue.createElementVNode("text", { class: "nav-icon" }, "🗺️")
          ])
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScroll: $setup.onScroll,
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["map-card", { "item-active": $setup.isClick }]),
              onClick: $setup.gotoMapFull
            },
            [
              vue.createElementVNode("view", { class: "map-card-header" }, [
                vue.createElementVNode("text", { class: "card-title" }, "实时定位地图"),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["map-status", { "status-normal": $setup.isLocationNormal }])
                  },
                  vue.toDisplayString($setup.isLocationNormal ? "定位正常" : "定位异常"),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "map-container" }, [
                vue.createElementVNode("image", {
                  class: "map-placeholder",
                  src: _imports_0,
                  mode: "aspectFill"
                }),
                $setup.isMapLoading ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "map-loading"
                }, [
                  vue.createElementVNode("text", { class: "loading-text" }, "地图加载中...")
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode("view", { class: "location-info-card" }, [
            vue.createElementVNode("view", { class: "card-header" }, [
              vue.createElementVNode("text", { class: "card-title" }, "当前位置"),
              vue.createElementVNode("text", { class: "safe-tag" }, "安全")
            ]),
            vue.createElementVNode("view", { class: "info-list" }, [
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "位置"),
                vue.createElementVNode("text", { class: "info-value" }, "在家中 · 客厅")
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "详细地址"),
                vue.createElementVNode("text", { class: "info-value" }, "XX市XX区XX街道XX号XX小区3栋2单元501")
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "更新时间"),
                vue.createElementVNode("text", { class: "info-value" }, "2分钟前")
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "定位精度"),
                vue.createElementVNode("text", { class: "info-value precision-high" }, "高 (±5米)")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "location-history-card mb-20" }, [
            vue.createElementVNode("view", { class: "card-header" }, [
              vue.createElementVNode("text", { class: "card-title" }, "位置历史"),
              vue.createElementVNode("text", { class: "history-count" }, "2条")
            ]),
            vue.createElementVNode("view", { class: "history-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.historyList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "history-item",
                    key: index
                  }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["history-icon-box", item.iconBg])
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          { class: "history-icon" },
                          vue.toDisplayString(item.icon),
                          1
                          /* TEXT */
                        )
                      ],
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode("view", { class: "history-content" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "history-place" },
                        vue.toDisplayString(item.place),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "history-time" },
                        vue.toDisplayString(item.time),
                        1
                        /* TEXT */
                      )
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ],
        36
        /* STYLE, NEED_HYDRATION */
      )
    ]);
  }
  const PagesLocationLocation = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-4d9b4fcb"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/location/location.vue"]]);
  const _imports_1 = "/static/images/record-placeholder.png";
  const _sfc_main$7 = {
    __name: "video-detail",
    setup(__props, { expose: __expose }) {
      __expose();
      const isScroll = vue.ref(false);
      const scrollViewHeight = vue.ref(0);
      const isVideoOnline = vue.ref(true);
      const isVideoPlaying = vue.ref(false);
      const isRecording = vue.ref(false);
      const isVoiceTalking = vue.ref(false);
      const isClick = vue.ref(false);
      const cameraName = vue.ref("客厅摄像头A102");
      const cameraLocation = vue.ref("客厅 · 南向");
      const videoQuality = vue.ref("高清 1080P");
      const signalStrength = vue.ref("强");
      const updateTime = vue.ref("刚刚");
      let statusTimer = null;
      const recordList = vue.ref([
        { time: "今天 08:00", duration: "00:15:20", size: "256MB" },
        { time: "今天 07:00", duration: "00:30:12", size: "512MB" },
        { time: "昨天 20:00", duration: "01:05:45", size: "1.2GB" }
      ]);
      const qualityOptions = vue.ref([
        { name: "流畅 480P", desc: "省流量 · 低延迟" },
        { name: "标清 720P", desc: "平衡 · 常用" },
        { name: "高清 1080P", desc: "清晰 · 耗流量" }
      ]);
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
        const isLogin = uni.getStorageSync("isLogin");
        if (!isLogin) {
          uni.redirectTo({ url: "/pages/auth/auth" });
          uni.showToast({ title: "请先登录", icon: "none" });
          return;
        }
        simulateCameraStatus();
      });
      vue.onUnmounted(() => {
        if (statusTimer)
          clearInterval(statusTimer);
        if (isRecording.value)
          stopRecord();
        if (isVoiceTalking.value)
          toggleVoiceTalk();
      });
      const onScroll = (e) => {
        isScroll.value = e.detail.scrollTop > 20;
      };
      const goBack = () => {
        uni.navigateBack({ delta: 1 });
      };
      const toggleVideoPlay = () => {
        if (!isVideoOnline.value) {
          uni.showToast({ title: "摄像头离线，无法播放", icon: "none" });
          return;
        }
        isVideoPlaying.value = !isVideoPlaying.value;
        if (isVideoPlaying.value) {
          uni.showToast({ title: "视频已播放", icon: "none" });
        } else {
          uni.showToast({ title: "视频已暂停", icon: "none" });
        }
      };
      const captureScreenshot = () => {
        handleFunctionClick2(() => {
          if (!isVideoOnline.value) {
            uni.showToast({ title: "摄像头离线，无法截图", icon: "none" });
            return;
          }
          uni.showToast({ title: "截图成功", icon: "success" });
        });
      };
      const startRecord = () => {
        handleFunctionClick2(() => {
          if (!isVideoOnline.value) {
            uni.showToast({ title: "摄像头离线，无法录制", icon: "none" });
            return;
          }
          isRecording.value = !isRecording.value;
          if (isRecording.value) {
            uni.showToast({ title: "开始录制", icon: "none" });
          } else {
            stopRecord();
          }
        });
      };
      const stopRecord = () => {
        isRecording.value = false;
        uni.showToast({ title: "录制已停止，视频已保存", icon: "success" });
      };
      const toggleVoiceTalk = () => {
        handleFunctionClick2(() => {
          if (!isVideoOnline.value) {
            uni.showToast({ title: "摄像头离线，无法对讲", icon: "none" });
            return;
          }
          isVoiceTalking.value = !isVoiceTalking.value;
          if (isVoiceTalking.value) {
            uni.showToast({ title: "对讲已开启", icon: "none" });
          } else {
            uni.showToast({ title: "对讲已关闭", icon: "none" });
          }
        });
      };
      const refreshCameraStatus = () => {
        handleFunctionClick2(() => {
          uni.showLoading({ title: "刷新中..." });
          setTimeout(() => {
            uni.hideLoading();
            updateTime.value = "刚刚";
            signalStrength.value = ["弱", "中", "强"][Math.floor(Math.random() * 3)];
            uni.showToast({ title: "状态已刷新", icon: "success" });
          }, 1e3);
        });
      };
      const changeQuality = (quality) => {
        handleFunctionClick2(() => {
          videoQuality.value = quality.name;
          uni.showToast({ title: `已切换至${quality.name}`, icon: "success" });
        });
      };
      const playRecord = (item) => {
        handleFunctionClick2(() => {
          uni.showToast({ title: `播放${item.time}的录像`, icon: "none" });
        });
      };
      const showAllRecord = () => {
        handleFunctionClick2(() => {
          uni.showToast({ title: "录像列表页面暂未开发", icon: "none" });
        });
      };
      const gotoVideoSetting = () => {
        uni.showToast({ title: "视频设置页面暂未开发", icon: "none" });
      };
      const simulateCameraStatus = () => {
        statusTimer = setInterval(() => {
          signalStrength.value = ["弱", "中", "强"][Math.floor(Math.random() * 3)];
          const randomOffline = Math.random() < 0.01;
          if (randomOffline) {
            isVideoOnline.value = false;
            isVideoPlaying.value = false;
            isRecording.value = false;
            isVoiceTalking.value = false;
            uni.showToast({ title: "摄像头已离线", icon: "none" });
            setTimeout(() => {
              isVideoOnline.value = true;
              updateTime.value = "刚刚";
              uni.showToast({ title: "摄像头已恢复在线", icon: "success" });
            }, 5e3);
          }
        }, 3e4);
      };
      const handleFunctionClick2 = (callback) => {
        isClick.value = true;
        setTimeout(() => {
          isClick.value = false;
          callback();
        }, 100);
      };
      const __returned__ = { isScroll, scrollViewHeight, isVideoOnline, isVideoPlaying, isRecording, isVoiceTalking, isClick, cameraName, cameraLocation, videoQuality, signalStrength, updateTime, get statusTimer() {
        return statusTimer;
      }, set statusTimer(v) {
        statusTimer = v;
      }, recordList, qualityOptions, onScroll, goBack, toggleVideoPlay, captureScreenshot, startRecord, stopRecord, toggleVoiceTalk, refreshCameraStatus, changeQuality, playRecord, showAllRecord, gotoVideoSetting, simulateCameraStatus, handleFunctionClick: handleFunctionClick2, customTabbar, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-video-detail" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["page-header", { "header-scroll": $setup.isScroll }])
        },
        [
          vue.createElementVNode("button", {
            class: "header-btn",
            onClick: $setup.goBack
          }, [
            vue.createElementVNode("text", { class: "back-icon" }, "←")
          ]),
          vue.createElementVNode("text", { class: "header-title" }, "实时画面"),
          vue.createElementVNode("button", {
            class: "header-btn",
            onClick: $setup.gotoVideoSetting
          }, [
            vue.createElementVNode("text", { class: "setting-icon" }, "⚙️")
          ])
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScroll: $setup.onScroll,
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "video-player-card" }, [
            vue.createElementVNode("view", {
              class: "video-container",
              onClick: $setup.toggleVideoPlay
            }, [
              !$setup.isVideoPlaying ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                class: "video-placeholder",
                src: _imports_0$2,
                mode: "aspectFill"
              })) : vue.createCommentVNode("v-if", true),
              $setup.isVideoOnline ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "live-tag"
              }, [
                vue.createElementVNode("view", { class: "status-dot pulse" }),
                vue.createElementVNode("text", { class: "live-text" }, "直播中")
              ])) : vue.createCommentVNode("v-if", true),
              !$setup.isVideoPlaying && $setup.isVideoOnline ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "video-play-btn"
              }, [
                vue.createElementVNode("text", { class: "play-icon" }, "▶")
              ])) : vue.createCommentVNode("v-if", true),
              $setup.isVideoPlaying && $setup.isVideoOnline ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 3,
                class: "video-pause-btn"
              }, [
                vue.createElementVNode("text", { class: "pause-icon" }, "❚❚")
              ])) : vue.createCommentVNode("v-if", true),
              !$setup.isVideoOnline ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 4,
                class: "video-status-tip"
              }, [
                vue.createElementVNode("text", { class: "status-tip-icon" }, "📴"),
                vue.createElementVNode("text", { class: "status-tip-text" }, "摄像头离线")
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            $setup.isVideoOnline ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "video-control-bar"
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["control-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.captureScreenshot
                },
                [
                  vue.createElementVNode("text", { class: "control-icon" }, "📷"),
                  vue.createElementVNode("text", { class: "control-text" }, "截图")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["control-item", { "item-active": $setup.isClick, "recording": $setup.isRecording }]),
                  onClick: $setup.startRecord
                },
                [
                  vue.createElementVNode("text", { class: "control-icon" }, "🎥"),
                  vue.createElementVNode(
                    "text",
                    { class: "control-text" },
                    vue.toDisplayString($setup.isRecording ? "停止录制" : "录制"),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["control-item", { "item-active": $setup.isClick, "talking": $setup.isVoiceTalking }]),
                  onClick: $setup.toggleVoiceTalk
                },
                [
                  vue.createElementVNode("text", { class: "control-icon" }, "🎤"),
                  vue.createElementVNode(
                    "text",
                    { class: "control-text" },
                    vue.toDisplayString($setup.isVoiceTalking ? "关闭对讲" : "语音对讲"),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "camera-info-card" }, [
            vue.createElementVNode("view", { class: "info-header" }, [
              vue.createElementVNode("text", { class: "info-title" }, "摄像头信息"),
              vue.createElementVNode("button", {
                class: "refresh-btn",
                onClick: $setup.refreshCameraStatus
              }, [
                vue.createElementVNode("text", { class: "refresh-icon" }, "🔄")
              ])
            ]),
            vue.createElementVNode("view", { class: "info-grid" }, [
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "设备名称"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($setup.cameraName),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "位置"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($setup.cameraLocation),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "连接状态"),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["info-value", $setup.isVideoOnline ? "online" : "offline"])
                  },
                  vue.toDisplayString($setup.isVideoOnline ? "在线" : "离线"),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "画质"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($setup.videoQuality),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "信号强度"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($setup.signalStrength),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "最后更新"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($setup.updateTime),
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "record-playback-card" }, [
            vue.createElementVNode("view", { class: "playback-header" }, [
              vue.createElementVNode("text", { class: "playback-title" }, "录像回放"),
              vue.createElementVNode("button", {
                class: "playback-more",
                onClick: $setup.showAllRecord
              }, [
                vue.createElementVNode("text", { class: "more-text" }, "查看全部")
              ])
            ]),
            vue.createElementVNode("view", { class: "playback-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.recordList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "playback-item",
                    key: index,
                    onClick: ($event) => $setup.playRecord(item)
                  }, [
                    vue.createElementVNode("view", { class: "playback-thumb" }, [
                      vue.createElementVNode("image", {
                        class: "thumb-img",
                        src: _imports_1,
                        mode: "aspectFill"
                      }),
                      vue.createElementVNode(
                        "text",
                        { class: "record-duration" },
                        vue.toDisplayString(item.duration),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "playback-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "record-time" },
                        vue.toDisplayString(item.time),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "record-size" },
                        vue.toDisplayString(item.size),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "quality-setting-card" }, [
            vue.createElementVNode("view", { class: "setting-header" }, [
              vue.createElementVNode("text", { class: "setting-title" }, "画质设置")
            ]),
            vue.createElementVNode("view", { class: "quality-options" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.qualityOptions, (quality, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["quality-option", { "active": $setup.videoQuality === quality.name }]),
                    key: index,
                    onClick: ($event) => $setup.changeQuality(quality)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "quality-name" },
                      vue.toDisplayString(quality.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "quality-desc" },
                      vue.toDisplayString(quality.desc),
                      1
                      /* TEXT */
                    ),
                    $setup.videoQuality === quality.name ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "check-icon"
                    }, "✓")) : vue.createCommentVNode("v-if", true)
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ],
        36
        /* STYLE, NEED_HYDRATION */
      ),
      vue.createVNode($setup["customTabbar"])
    ]);
  }
  const PagesVideoDetailVideoDetail = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-42c36e79"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/video-detail/video-detail.vue"]]);
  const _sfc_main$6 = {
    __name: "medicine",
    setup(__props, { expose: __expose }) {
      __expose();
      const scrollViewHeight = vue.ref(0);
      const isClick = vue.ref(false);
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
        const isLogin = uni.getStorageSync("isLogin");
        if (!isLogin) {
          uni.redirectTo({ url: "/pages/auth/auth" });
          uni.showToast({ title: "请先登录", icon: "none" });
          return;
        }
      });
      const closeMedicine = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      const addMedicine = () => {
        formatAppLog("log", "at pages/medicine/medicine.vue:134", "执行添加用药记录页跳转，路径：/pages/medicine/add-medicine");
        uni.navigateTo({
          url: "/pages/medicine/add-medicine",
          fail: (err) => {
            formatAppLog("error", "at pages/medicine/medicine.vue:138", "添加用药记录页跳转失败：", err);
            if (err.errMsg.includes("page not found")) {
              uni.navigateTo({
                url: "/pages/medicine/medicine",
                fail: (err2) => {
                  formatAppLog("error", "at pages/medicine/medicine.vue:144", "用药记录主页面跳转失败：", err2);
                  uni.showToast({
                    title: "用药记录页面暂未开发",
                    icon: "none",
                    duration: 2e3
                  });
                }
              });
            } else {
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          }
        });
      };
      const markTaken = (medicineName) => {
        handleFunctionClick2(() => {
          uni.showToast({
            title: `${medicineName}已标记为服用`,
            icon: "success",
            duration: 1500
          });
        });
      };
      const handleFunctionClick2 = (callback) => {
        isClick.value = true;
        setTimeout(() => {
          isClick.value = false;
          callback();
        }, 100);
      };
      const __returned__ = { scrollViewHeight, isClick, closeMedicine, addMedicine, markTaken, handleFunctionClick: handleFunctionClick2, customTabbar, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-medicine" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("button", {
          class: "header-back-btn",
          onClick: $setup.closeMedicine
        }, [
          vue.createElementVNode("text", { class: "back-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "header-title" }, "用药管理"),
        vue.createElementVNode("button", {
          class: "header-add-btn",
          onClick: $setup.addMedicine
        }, [
          vue.createElementVNode("text", { class: "add-icon" }, "+")
        ])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "medicine-list" }, [
            vue.createElementVNode("view", { class: "medicine-card" }, [
              vue.createElementVNode("view", { class: "medicine-card-header" }, [
                vue.createElementVNode("view", { class: "medicine-icon-box green-bg" }, "💊"),
                vue.createElementVNode("view", { class: "medicine-info" }, [
                  vue.createElementVNode("text", { class: "medicine-name" }, "降压药"),
                  vue.createElementVNode("text", { class: "medicine-desc" }, "硝苯地平缓释片")
                ]),
                vue.createElementVNode("text", { class: "medicine-status" }, "进行中")
              ]),
              vue.createElementVNode("view", { class: "medicine-detail" }, [
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "服用时间"),
                  vue.createElementVNode("text", { class: "detail-value" }, "每日 08:00")
                ]),
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "剂量"),
                  vue.createElementVNode("text", { class: "detail-value" }, "1片/次")
                ]),
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "剩余数量"),
                  vue.createElementVNode("text", { class: "detail-value orange-text" }, "15片")
                ])
              ]),
              vue.createElementVNode("button", {
                class: "take-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => $setup.markTaken("降压药"))
              }, "标记已服用")
            ]),
            vue.createElementVNode("view", { class: "medicine-card" }, [
              vue.createElementVNode("view", { class: "medicine-card-header" }, [
                vue.createElementVNode("view", { class: "medicine-icon-box purple-bg" }, "💊"),
                vue.createElementVNode("view", { class: "medicine-info" }, [
                  vue.createElementVNode("text", { class: "medicine-name" }, "降糖药"),
                  vue.createElementVNode("text", { class: "medicine-desc" }, "二甲双胍片")
                ]),
                vue.createElementVNode("text", { class: "medicine-status" }, "进行中")
              ]),
              vue.createElementVNode("view", { class: "medicine-detail" }, [
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "服用时间"),
                  vue.createElementVNode("text", { class: "detail-value" }, "每日 08:00, 18:00")
                ]),
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "剂量"),
                  vue.createElementVNode("text", { class: "detail-value" }, "1片/次")
                ]),
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "剩余数量"),
                  vue.createElementVNode("text", { class: "detail-value green-text" }, "42片")
                ])
              ]),
              vue.createElementVNode("button", {
                class: "take-btn purple-btn",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.markTaken("降糖药"))
              }, "标记已服用")
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createVNode($setup["customTabbar"])
    ]);
  }
  const PagesMedicineMedicine = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__scopeId", "data-v-47346f61"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/medicine/medicine.vue"]]);
  const _sfc_main$5 = {
    __name: "environment",
    setup(__props, { expose: __expose }) {
      __expose();
      const temperature = vue.ref(24.5);
      const humidity = vue.ref(48);
      const envStatusText = vue.ref("舒适");
      const tempMin = vue.ref(22);
      const tempMax = vue.ref(26);
      const tempProgress = vue.ref(75);
      const humiMin = vue.ref(45);
      const humiMax = vue.ref(55);
      const humiProgress = vue.ref(60);
      const suggestList = vue.ref([
        { icon: "✓", iconClass: "suggest-icon-success", text: "当前温湿度适宜，环境舒适" },
        { icon: "ℹ", iconClass: "suggest-icon-info", text: "建议定时开窗通风，保持空气流通" }
      ]);
      const roomList = vue.ref([
        {
          icon: "🛏️",
          iconClass: "room-icon-purple",
          name: "卧室",
          temp: 23,
          humi: 52,
          status: "舒适",
          statusClass: "room-status-green"
        },
        {
          icon: "🍳",
          iconClass: "room-icon-orange",
          name: "厨房",
          temp: 26,
          humi: 55,
          status: "正常",
          statusClass: "room-status-green"
        }
      ]);
      const isScroll = vue.ref(false);
      const isClick = vue.ref(false);
      const scrollViewHeight = vue.ref(0);
      let dataTimer = null;
      const onScroll = (e) => {
        isScroll.value = e.detail.scrollTop > 20;
      };
      const handleFunctionClick2 = (callback) => {
        isClick.value = true;
        setTimeout(() => {
          isClick.value = false;
          callback();
        }, 100);
      };
      const simulateEnvDataRefresh = () => {
        dataTimer = setInterval(() => {
          temperature.value = Number((temperature.value + (Math.random() - 0.5) * 0.8).toFixed(1));
          temperature.value = Math.max(tempMin.value, Math.min(tempMax.value, temperature.value));
          humidity.value = Math.round(humidity.value + (Math.random() - 0.5) * 3);
          humidity.value = Math.max(humiMin.value, Math.min(humiMax.value, humidity.value));
          tempProgress.value = (temperature.value - tempMin.value) / (tempMax.value - tempMin.value) * 100;
          humiProgress.value = (humidity.value - humiMin.value) / (humiMax.value - humiMin.value) * 100;
          if (temperature.value > 28) {
            envStatusText.value = "高温";
          } else if (temperature.value < 18) {
            envStatusText.value = "低温";
          } else if (humidity.value > 60) {
            envStatusText.value = "高湿";
          } else if (humidity.value < 30) {
            envStatusText.value = "低湿";
          } else {
            envStatusText.value = "舒适";
          }
          roomList.value.forEach((room) => {
            room.temp = Number((room.temp + (Math.random() - 0.5) * 0.5).toFixed(1));
            room.humi = Math.round(room.humi + (Math.random() - 0.5) * 2);
          });
        }, 5e3);
      };
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
        simulateEnvDataRefresh();
      });
      vue.onUnmounted(() => {
        if (dataTimer)
          clearInterval(dataTimer);
      });
      const closeEnvironment = () => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/environment/environment.vue:233", "执行环境详情页返回，上一页：首页");
          uni.navigateBack({
            delta: 1,
            fail: (err) => {
              formatAppLog("error", "at pages/environment/environment.vue:237", "环境详情页返回失败：", err);
              uni.showToast({
                title: `返回失败：${err.errMsg}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const refreshEnvData = () => {
        handleFunctionClick2(async () => {
          uni.showLoading({ title: "刷新中..." });
          try {
            simulateSingleRefresh();
            uni.showToast({ title: "刷新成功", icon: "success", duration: 1500 });
          } catch (err) {
            formatAppLog("error", "at pages/environment/environment.vue:260", "环境数据刷新失败：", err);
            uni.showToast({
              title: "刷新失败，请重试",
              icon: "none",
              duration: 3e3
            });
          } finally {
            uni.hideLoading();
          }
        });
      };
      const simulateSingleRefresh = () => {
        temperature.value = Number((temperature.value + (Math.random() - 0.5) * 1.2).toFixed(1));
        temperature.value = Math.max(tempMin.value, Math.min(tempMax.value, temperature.value));
        humidity.value = Math.round(humidity.value + (Math.random() - 0.5) * 5);
        humidity.value = Math.max(humiMin.value, Math.min(humiMax.value, humidity.value));
        tempProgress.value = (temperature.value - tempMin.value) / (tempMax.value - tempMin.value) * 100;
        humiProgress.value = (humidity.value - humiMin.value) / (humiMax.value - humiMin.value) * 100;
        if (temperature.value > 28) {
          envStatusText.value = "高温";
        } else if (temperature.value < 18) {
          envStatusText.value = "低温";
        } else if (humidity.value > 60) {
          envStatusText.value = "高湿";
        } else if (humidity.value < 30) {
          envStatusText.value = "低湿";
        } else {
          envStatusText.value = "舒适";
        }
        roomList.value.forEach((room) => {
          room.temp = Number((room.temp + (Math.random() - 0.5) * 0.8).toFixed(1));
          room.humi = Math.round(room.humi + (Math.random() - 0.5) * 3);
        });
      };
      const getEnvDataFromBackend = async () => {
        try {
          const res = await request("/environment/get", "GET");
          temperature.value = res.temperature;
          humidity.value = res.humidity;
          envStatusText.value = res.envStatusText;
          tempProgress.value = res.tempProgress;
          humiProgress.value = res.humiProgress;
          roomList.value = res.roomList;
          suggestList.value = res.suggestList;
        } catch (err) {
          throw err;
        }
      };
      const __returned__ = { temperature, humidity, envStatusText, tempMin, tempMax, tempProgress, humiMin, humiMax, humiProgress, suggestList, roomList, isScroll, isClick, scrollViewHeight, get dataTimer() {
        return dataTimer;
      }, set dataTimer(v) {
        dataTimer = v;
      }, onScroll, handleFunctionClick: handleFunctionClick2, simulateEnvDataRefresh, closeEnvironment, refreshEnvData, simulateSingleRefresh, getEnvDataFromBackend, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-environment" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["page-header", { "header-scroll": $setup.isScroll }])
        },
        [
          vue.createElementVNode("button", {
            class: "header-btn back-btn",
            onClick: $setup.closeEnvironment
          }, [
            vue.createElementVNode("text", { class: "back-icon" }, "←")
          ]),
          vue.createElementVNode("text", { class: "header-title" }, "环境监测"),
          vue.createElementVNode("button", {
            class: "header-btn refresh-btn",
            onClick: $setup.refreshEnvData
          }, [
            vue.createElementVNode("text", { class: "refresh-icon" }, "🔄")
          ])
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScroll: $setup.onScroll,
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "env-card" }, [
            vue.createElementVNode("view", { class: "env-card-header" }, [
              vue.createElementVNode("view", { class: "env-card-title" }, [
                vue.createElementVNode("text", { class: "env-card-subtitle" }, "当前环境"),
                vue.createElementVNode(
                  "text",
                  { class: "env-card-main-title" },
                  "客厅 · " + vue.toDisplayString($setup.envStatusText),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["env-card-status", { "status-warning": $setup.envStatusText !== "舒适" }])
                },
                vue.toDisplayString($setup.envStatusText !== "舒适" ? "⚠️ " : "") + "实时监测中 ",
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "env-card-grid" }, [
              vue.createElementVNode("view", { class: "env-card-item" }, [
                vue.createElementVNode("text", { class: "env-item-label" }, "室内温度"),
                vue.createElementVNode(
                  "text",
                  { class: "env-item-value" },
                  vue.toDisplayString($setup.temperature) + "°C",
                  1
                  /* TEXT */
                ),
                $setup.temperature > 28 ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "env-item-tip"
                }, "偏高")) : $setup.temperature < 18 ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "env-item-tip"
                }, "偏低")) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 2,
                  class: "env-item-tip",
                  style: { "display": "none" }
                }))
              ]),
              vue.createElementVNode("view", { class: "env-card-item" }, [
                vue.createElementVNode("text", { class: "env-item-label" }, "室内湿度"),
                vue.createElementVNode(
                  "text",
                  { class: "env-item-value" },
                  vue.toDisplayString($setup.humidity) + "%",
                  1
                  /* TEXT */
                ),
                $setup.humidity > 60 ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "env-item-tip"
                }, "偏湿")) : $setup.humidity < 30 ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "env-item-tip"
                }, "偏干")) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 2,
                  class: "env-item-tip",
                  style: { "display": "none" }
                }))
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "trend-card common-card" }, [
            vue.createElementVNode("text", { class: "card-title" }, "24小时趋势"),
            vue.createElementVNode("view", { class: "trend-list" }, [
              vue.createElementVNode("view", { class: "trend-item" }, [
                vue.createElementVNode("view", { class: "trend-item-header" }, [
                  vue.createElementVNode("text", { class: "trend-label" }, "温度"),
                  vue.createElementVNode(
                    "text",
                    { class: "trend-range" },
                    vue.toDisplayString($setup.tempMin) + "°C - " + vue.toDisplayString($setup.tempMax) + "°C",
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "progress-bg" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "progress-bar temp-progress",
                      style: vue.normalizeStyle({ width: $setup.tempProgress + "%" })
                    },
                    null,
                    4
                    /* STYLE */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "trend-item" }, [
                vue.createElementVNode("view", { class: "trend-item-header" }, [
                  vue.createElementVNode("text", { class: "trend-label" }, "湿度"),
                  vue.createElementVNode(
                    "text",
                    { class: "trend-range" },
                    vue.toDisplayString($setup.humiMin) + "% - " + vue.toDisplayString($setup.humiMax) + "%",
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "progress-bg" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "progress-bar humi-progress",
                      style: vue.normalizeStyle({ width: $setup.humiProgress + "%" })
                    },
                    null,
                    4
                    /* STYLE */
                  )
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "suggest-card common-card" }, [
            vue.createElementVNode("text", { class: "card-title" }, "环境建议"),
            vue.createElementVNode("view", { class: "suggest-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.suggestList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "suggest-item",
                    key: index
                  }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["suggest-icon", item.iconClass])
                      },
                      vue.toDisplayString(item.icon),
                      3
                      /* TEXT, CLASS */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "suggest-text" },
                      vue.toDisplayString(item.text),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "other-room-card common-card mb-20" }, [
            vue.createElementVNode("text", { class: "card-title" }, "其他房间"),
            vue.createElementVNode("view", { class: "room-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.roomList, (room, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "room-item",
                    key: index
                  }, [
                    vue.createElementVNode("view", { class: "room-left" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["room-icon", room.iconClass])
                        },
                        vue.toDisplayString(room.icon),
                        3
                        /* TEXT, CLASS */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "room-name" },
                        vue.toDisplayString(room.name),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "room-right" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "room-data" },
                        vue.toDisplayString(room.temp) + "°C · " + vue.toDisplayString(room.humi) + "%",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["room-status", room.statusClass])
                        },
                        vue.toDisplayString(room.status),
                        3
                        /* TEXT, CLASS */
                      )
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ],
        36
        /* STYLE, NEED_HYDRATION */
      )
    ]);
  }
  const PagesEnvironmentEnvironment = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-225b3afe"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/environment/environment.vue"]]);
  const _sfc_main$4 = {
    __name: "device-manage",
    setup(__props, { expose: __expose }) {
      __expose();
      const deviceGroups = vue.ref([
        {
          name: "环境监测设备",
          devices: [
            {
              id: 1,
              name: "温湿度传感器",
              desc: "客厅 · 编号WH202401",
              icon: "🌡️",
              online: true,
              status: true
            },
            {
              id: 2,
              name: "烟雾传感器",
              desc: "厨房 · 编号SM202402",
              icon: "🔥",
              online: true,
              status: true
            },
            {
              id: 3,
              name: "跌倒检测器",
              desc: "卧室 · 编号FD202403",
              icon: "🚨",
              online: true,
              status: true
            }
          ]
        },
        {
          name: "智能控制设备",
          devices: [
            {
              id: 4,
              name: "智能摄像头",
              desc: "客厅 · 编号CAM202404",
              icon: "📹",
              online: true,
              status: true
            },
            {
              id: 5,
              name: "紧急呼叫按钮",
              desc: "卫生间 · 编号EC202405",
              icon: "🆘",
              online: true,
              status: true
            },
            {
              id: 6,
              name: "智能灯光",
              desc: "卧室 · 编号LT202406",
              icon: "💡",
              online: false,
              status: false
            }
          ]
        }
      ]);
      const goBack = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      const addDevice = () => {
        uni.showToast({
          title: "添加设备功能开发中",
          icon: "none",
          duration: 2e3
        });
      };
      const controlDevice = (device) => {
        device.status = !device.status;
        uni.showToast({
          title: `${device.name}已${device.status ? "开启" : "关闭"}`,
          icon: "success",
          duration: 2e3
        });
      };
      const __returned__ = { deviceGroups, goBack, addDevice, controlDevice, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-device-manage" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("button", {
          class: "back-btn",
          onClick: $setup.goBack
        }, [
          vue.createElementVNode("text", { class: "back-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "header-title" }, "设备管理"),
        vue.createElementVNode("button", {
          class: "add-btn",
          onClick: $setup.addDevice
        }, [
          vue.createElementVNode("text", { class: "add-icon" }, "+")
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "device-list",
        "scroll-y": ""
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.deviceGroups, (group, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "device-group",
              key: index
            }, [
              vue.createElementVNode(
                "text",
                { class: "group-title" },
                vue.toDisplayString(group.name),
                1
                /* TEXT */
              ),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(group.devices, (device, idx) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "device-item",
                    key: idx
                  }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["device-icon", device.online ? "online" : "offline"])
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          { class: "icon-text" },
                          vue.toDisplayString(device.icon),
                          1
                          /* TEXT */
                        )
                      ],
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode("view", { class: "device-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "device-name" },
                        vue.toDisplayString(device.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "device-desc" },
                        vue.toDisplayString(device.desc),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["device-status", device.online ? "status-online" : "status-offline"])
                        },
                        vue.toDisplayString(device.online ? "在线" : "离线"),
                        3
                        /* TEXT, CLASS */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "device-actions" }, [
                      vue.createElementVNode("button", {
                        class: "control-btn",
                        onClick: vue.withModifiers(($event) => $setup.controlDevice(device), ["stop"])
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "control-text" },
                          vue.toDisplayString(device.status ? "关闭" : "开启"),
                          1
                          /* TEXT */
                        )
                      ], 8, ["onClick"])
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesDeviceManageDeviceManage = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-2b05eac0"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/device-manage/device-manage.vue"]]);
  const _sfc_main$3 = {
    __name: "setting",
    setup(__props, { expose: __expose }) {
      __expose();
      const isScroll = vue.ref(false);
      const isClick = vue.ref(false);
      const scrollViewHeight = vue.ref(0);
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
      });
      vue.onUnmounted(() => {
      });
      const onScroll = (e) => {
        isScroll.value = e.detail.scrollTop > 20;
      };
      const handleFunctionClick2 = (callback) => {
        isClick.value = true;
        setTimeout(() => {
          isClick.value = false;
          callback();
        }, 100);
      };
      const gotoNoticeSetting = () => {
        handleFunctionClick2(() => {
          uni.navigateTo({
            url: "/pages/setting/notice/notice",
            fail: (err) => {
              formatAppLog("error", "at pages/setting/setting.vue:174", "通知设置页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const gotoPrivacySetting = () => {
        handleFunctionClick2(() => {
          uni.navigateTo({
            url: "/pages/setting/privacy/privacy",
            fail: (err) => {
              formatAppLog("error", "at pages/setting/setting.vue:191", "隐私设置页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const gotoLanguageSetting = () => {
        handleFunctionClick2(() => {
          uni.showToast({
            title: "语言设置页开发中",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const gotoChangePwd = () => {
        handleFunctionClick2(() => {
          uni.showToast({
            title: "修改密码页开发中",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const gotoBindPhone = () => {
        handleFunctionClick2(() => {
          uni.showToast({
            title: "绑定手机号页开发中",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const gotoEmergencyContact = () => {
        handleFunctionClick2(() => {
          uni.showToast({
            title: "紧急联系人页开发中",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const gotoAboutUs = () => {
        handleFunctionClick2(() => {
          uni.showToast({
            title: "关于我们页开发中",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const gotoUserAgreement = () => {
        handleFunctionClick2(() => {
          uni.showToast({
            title: "用户协议页开发中",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const gotoPrivacyPolicy = () => {
        handleFunctionClick2(() => {
          uni.showToast({
            title: "隐私政策页开发中",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const __returned__ = { isScroll, isClick, scrollViewHeight, onScroll, handleFunctionClick: handleFunctionClick2, gotoNoticeSetting, gotoPrivacySetting, gotoLanguageSetting, gotoChangePwd, gotoBindPhone, gotoEmergencyContact, gotoAboutUs, gotoUserAgreement, gotoPrivacyPolicy, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-setting" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["page-header", { "header-scroll": $setup.isScroll }])
        },
        [
          vue.createElementVNode("text", { class: "header-title" }, "设置"),
          vue.createElementVNode("view", { class: "header-placeholder" })
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScroll: $setup.onScroll,
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "setting-card" }, [
            vue.createElementVNode("view", { class: "setting-card-header" }, [
              vue.createElementVNode("text", { class: "setting-card-subtitle" }, "通用设置")
            ]),
            vue.createElementVNode("view", { class: "setting-list divide-y" }, [
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["setting-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoNoticeSetting
                },
                [
                  vue.createElementVNode("view", { class: "setting-item-left" }, [
                    vue.createElementVNode("text", { class: "setting-icon" }, "🔔"),
                    vue.createElementVNode("text", { class: "setting-item-text" }, "通知设置")
                  ]),
                  vue.createElementVNode("text", { class: "setting-arrow" }, "▶")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["setting-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoPrivacySetting
                },
                [
                  vue.createElementVNode("view", { class: "setting-item-left" }, [
                    vue.createElementVNode("text", { class: "setting-icon" }, "🔒"),
                    vue.createElementVNode("text", { class: "setting-item-text" }, "隐私设置")
                  ]),
                  vue.createElementVNode("text", { class: "setting-arrow" }, "▶")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["setting-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoLanguageSetting
                },
                [
                  vue.createElementVNode("view", { class: "setting-item-left" }, [
                    vue.createElementVNode("text", { class: "setting-icon" }, "🌐"),
                    vue.createElementVNode("text", { class: "setting-item-text" }, "语言")
                  ]),
                  vue.createElementVNode("view", { class: "setting-item-right" }, [
                    vue.createElementVNode("text", { class: "language-text" }, "简体中文"),
                    vue.createElementVNode("text", { class: "setting-arrow" }, "▶")
                  ])
                ],
                2
                /* CLASS */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "setting-card" }, [
            vue.createElementVNode("view", { class: "setting-card-header" }, [
              vue.createElementVNode("text", { class: "setting-card-subtitle" }, "账号与安全")
            ]),
            vue.createElementVNode("view", { class: "setting-list divide-y" }, [
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["setting-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoChangePwd
                },
                [
                  vue.createElementVNode("view", { class: "setting-item-left" }, [
                    vue.createElementVNode("text", { class: "setting-icon" }, "🔑"),
                    vue.createElementVNode("text", { class: "setting-item-text" }, "修改密码")
                  ]),
                  vue.createElementVNode("text", { class: "setting-arrow" }, "▶")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["setting-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoBindPhone
                },
                [
                  vue.createElementVNode("view", { class: "setting-item-left" }, [
                    vue.createElementVNode("text", { class: "setting-icon" }, "📱"),
                    vue.createElementVNode("text", { class: "setting-item-text" }, "绑定手机号")
                  ]),
                  vue.createElementVNode("text", { class: "setting-arrow" }, "▶")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["setting-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoEmergencyContact
                },
                [
                  vue.createElementVNode("view", { class: "setting-item-left" }, [
                    vue.createElementVNode("text", { class: "setting-icon" }, "❤️"),
                    vue.createElementVNode("text", { class: "setting-item-text" }, "紧急联系人")
                  ]),
                  vue.createElementVNode("text", { class: "setting-arrow" }, "▶")
                ],
                2
                /* CLASS */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "setting-card mb-20" }, [
            vue.createElementVNode("view", { class: "setting-card-header" }, [
              vue.createElementVNode("text", { class: "setting-card-subtitle" }, "关于")
            ]),
            vue.createElementVNode("view", { class: "setting-list divide-y" }, [
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["setting-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoAboutUs
                },
                [
                  vue.createElementVNode("view", { class: "setting-item-left" }, [
                    vue.createElementVNode("text", { class: "setting-icon" }, "ℹ️"),
                    vue.createElementVNode("text", { class: "setting-item-text" }, "关于我们")
                  ]),
                  vue.createElementVNode("text", { class: "setting-arrow" }, "▶")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["setting-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoUserAgreement
                },
                [
                  vue.createElementVNode("view", { class: "setting-item-left" }, [
                    vue.createElementVNode("text", { class: "setting-icon" }, "📄"),
                    vue.createElementVNode("text", { class: "setting-item-text" }, "用户协议")
                  ]),
                  vue.createElementVNode("text", { class: "setting-arrow" }, "▶")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  class: vue.normalizeClass(["setting-item", { "item-active": $setup.isClick }]),
                  onClick: $setup.gotoPrivacyPolicy
                },
                [
                  vue.createElementVNode("view", { class: "setting-item-left" }, [
                    vue.createElementVNode("text", { class: "setting-icon" }, "📜"),
                    vue.createElementVNode("text", { class: "setting-item-text" }, "隐私政策")
                  ]),
                  vue.createElementVNode("text", { class: "setting-arrow" }, "▶")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode("view", { class: "setting-item no-click" }, [
                vue.createElementVNode("view", { class: "setting-item-left" }, [
                  vue.createElementVNode("text", { class: "setting-icon" }, "📱"),
                  vue.createElementVNode("text", { class: "setting-item-text" }, "版本号")
                ]),
                vue.createElementVNode("text", { class: "version-text" }, "v1.0.0")
              ])
            ])
          ])
        ],
        36
        /* STYLE, NEED_HYDRATION */
      )
    ]);
  }
  const PagesSettingSetting = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-018cdf56"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/setting/setting.vue"]]);
  const _sfc_main$2 = {
    __name: "add-medicine",
    setup(__props, { expose: __expose }) {
      __expose();
      const medicineForm = vue.ref({
        name: "",
        // 药品名称
        time: "",
        // 服用时间
        dosageNum: "",
        // 剂量数值
        remark: ""
        // 备注
      });
      const dosageUnits = vue.ref(["片", "粒", "包", "ml", "mg", "颗"]);
      const dosageUnitIndex = vue.ref(0);
      const frequencyList = vue.ref(["每日一次", "每日两次", "每日三次", "隔日一次", "每周一次"]);
      const frequencyIndex = vue.ref(0);
      const isSaving = vue.ref(false);
      const scrollViewHeight = vue.ref(0);
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH;
        } catch (e) {
          scrollViewHeight.value = 600;
        }
      });
      const onTimeChange = (e) => {
        medicineForm.value.time = e.detail.value;
      };
      const onDosageUnitChange = (e) => {
        dosageUnitIndex.value = e.detail.value;
      };
      const onFrequencyChange = (e) => {
        frequencyIndex.value = e.detail.value;
      };
      const validateForm = () => {
        if (!medicineForm.value.name.trim()) {
          uni.showToast({ title: "请输入药品名称", icon: "none" });
          return false;
        }
        if (!medicineForm.value.time) {
          uni.showToast({ title: "请选择服用时间", icon: "none" });
          return false;
        }
        if (!medicineForm.value.dosageNum || isNaN(medicineForm.value.dosageNum) || Number(medicineForm.value.dosageNum) <= 0) {
          uni.showToast({ title: "请输入有效的服用剂量", icon: "none" });
          return false;
        }
        return true;
      };
      const saveMedicine = () => {
        if (!validateForm())
          return;
        const newMedicine = {
          name: medicineForm.value.name.trim(),
          time: medicineForm.value.time,
          dosage: `${medicineForm.value.dosageNum}${dosageUnits.value[dosageUnitIndex.value]}`,
          frequency: frequencyList.value[frequencyIndex.value],
          remark: medicineForm.value.remark.trim() || "",
          done: false,
          // 默认未服用
          createTime: (/* @__PURE__ */ new Date()).toLocaleString()
          // 创建时间
        };
        isSaving.value = true;
        setTimeout(() => {
          const existingMedicines = uni.getStorageSync("medicineList") || [];
          existingMedicines.unshift(newMedicine);
          uni.setStorageSync("medicineList", existingMedicines);
          uni.showToast({ title: "添加成功", icon: "success" });
          setTimeout(() => {
            uni.navigateBack({ delta: 1 });
          }, 1500);
          isSaving.value = false;
        }, 1e3);
      };
      const goBack = () => {
        uni.navigateBack({ delta: 1 });
      };
      const __returned__ = { medicineForm, dosageUnits, dosageUnitIndex, frequencyList, frequencyIndex, isSaving, scrollViewHeight, onTimeChange, onDosageUnitChange, onFrequencyChange, validateForm, saveMedicine, goBack, ref: vue.ref, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-add-medicine" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("button", {
          class: "back-btn",
          onClick: $setup.goBack
        }, [
          vue.createElementVNode("text", { class: "back-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "header-title" }, "添加用药记录"),
        vue.createElementVNode("button", {
          class: "save-btn",
          onClick: $setup.saveMedicine,
          disabled: $setup.isSaving
        }, [
          vue.createElementVNode(
            "text",
            { class: "save-text" },
            vue.toDisplayString($setup.isSaving ? "保存中..." : "保存"),
            1
            /* TEXT */
          )
        ], 8, ["disabled"])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "form-container" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, [
                vue.createTextVNode("药品名称 "),
                vue.createElementVNode("text", { class: "required" }, "*")
              ]),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.medicineForm.name = $event),
                  placeholder: "请输入药品名称（如：降压药、降糖药）",
                  "placeholder-class": "input-placeholder"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.medicineForm.name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, [
                vue.createTextVNode("服用时间 "),
                vue.createElementVNode("text", { class: "required" }, "*")
              ]),
              vue.createElementVNode("picker", {
                mode: "time",
                value: $setup.medicineForm.time,
                onChange: $setup.onTimeChange,
                class: "form-picker"
              }, [
                vue.createElementVNode("view", { class: "picker-display" }, [
                  vue.createTextVNode(
                    vue.toDisplayString($setup.medicineForm.time || "请选择服用时间") + " ",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
                ])
              ], 40, ["value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, [
                vue.createTextVNode("服用剂量 "),
                vue.createElementVNode("text", { class: "required" }, "*")
              ]),
              vue.createElementVNode("view", { class: "dosage-input-wrap" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input dosage-input",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.medicineForm.dosageNum = $event),
                    type: "number",
                    placeholder: "请输入数量",
                    "placeholder-class": "input-placeholder"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.medicineForm.dosageNum]
                ]),
                vue.createElementVNode("picker", {
                  mode: "selector",
                  range: $setup.dosageUnits,
                  value: $setup.dosageUnitIndex,
                  onChange: $setup.onDosageUnitChange,
                  class: "dosage-unit-picker"
                }, [
                  vue.createElementVNode("view", { class: "unit-display" }, [
                    vue.createTextVNode(
                      vue.toDisplayString($setup.dosageUnits[$setup.dosageUnitIndex]) + " ",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
                  ])
                ], 40, ["range", "value"])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "服用频率"),
              vue.createElementVNode("picker", {
                mode: "selector",
                range: $setup.frequencyList,
                value: $setup.frequencyIndex,
                onChange: $setup.onFrequencyChange,
                class: "form-picker"
              }, [
                vue.createElementVNode("view", { class: "picker-display" }, [
                  vue.createTextVNode(
                    vue.toDisplayString($setup.frequencyList[$setup.frequencyIndex]) + " ",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
                ])
              ], 40, ["range", "value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "备注说明"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "form-textarea",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.medicineForm.remark = $event),
                  placeholder: "请输入备注信息（如：饭后服用、睡前服用）",
                  "placeholder-class": "input-placeholder",
                  maxlength: "200"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.medicineForm.remark]
              ])
            ])
          ])
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesMedicineAddMedicine = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-b0f2ef81"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/medicine/add-medicine.vue"]]);
  const _sfc_main$1 = {
    __name: "community",
    setup(__props, { expose: __expose }) {
      __expose();
      const isScroll = vue.ref(false);
      const isClick = vue.ref(false);
      const scrollViewHeight = vue.ref(0);
      const activeCate = vue.ref(0);
      const joinClick = vue.ref(false);
      const cateList = vue.ref([
        "全部活动",
        "养生讲座",
        "文体活动",
        "手工课堂",
        "健康义诊",
        "公益帮扶"
      ]);
      const activityList = vue.ref([
        {
          id: 1,
          title: "中老年高血压预防与调理养生讲座",
          cover: "/static/images/activity1.png",
          tag: "热门",
          time: "2026-05-20 09:30-11:30",
          address: "社区服务中心1楼会议室",
          joinNum: 86
        },
        {
          id: 2,
          title: "社区广场舞交流赛（中老年组）",
          cover: "/static/images/activity2.png",
          tag: "新上线",
          time: "2026-05-25 14:00-16:30",
          address: "社区文化广场",
          joinNum: 128
        },
        {
          id: 3,
          title: "中老年手工剪纸课堂（免费）",
          cover: "/static/images/activity3.png",
          time: "2026-05-22 10:00-12:00",
          address: "社区老年活动中心",
          joinNum: 52
        },
        {
          id: 4,
          title: "社区免费健康义诊（测血糖/血压）",
          cover: "/static/images/activity4.png",
          tag: "公益",
          time: "2026-05-28 08:30-11:30",
          address: "社区大门口广场",
          joinNum: 203
        }
      ]);
      vue.onMounted(() => {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const screenHeight = systemInfo.windowHeight;
          const statusBarH = systemInfo.statusBarHeight || 0;
          const navBarH = 88 / 2;
          const tabBarH = 100 / 2;
          scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
        } catch (e) {
          scrollViewHeight.value = 500;
        }
      });
      vue.onUnmounted(() => {
      });
      const onScroll = (e) => {
        isScroll.value = e.detail.scrollTop > 20;
      };
      const handleFunctionClick2 = (callback) => {
        isClick.value = true;
        setTimeout(() => {
          isClick.value = false;
          callback();
        }, 100);
      };
      const handleJoinClick = (callback) => {
        joinClick.value = true;
        setTimeout(() => {
          joinClick.value = false;
          callback();
        }, 100);
      };
      const switchCate = (index) => {
        handleFunctionClick2(() => {
          activeCate.value = index;
          uni.showToast({
            title: `已切换为【${cateList[index]}】`,
            icon: "success",
            duration: 1500
          });
        });
      };
      const gotoSearch = () => {
        handleFunctionClick2(() => {
          uni.showToast({
            title: "活动搜索页开发中",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const gotoActivityDetail = (id) => {
        handleFunctionClick2(() => {
          formatAppLog("log", "at pages/community/community.vue:225", "跳转到活动详情页，活动ID：", id);
          uni.navigateTo({
            url: `/pages/community/activity-detail/activity-detail?id=${id}`,
            fail: (err) => {
              formatAppLog("error", "at pages/community/community.vue:229", "活动详情页跳转失败：", err);
              uni.showToast({
                title: `跳转失败：${err.errMsg || "页面不存在"}`,
                icon: "none",
                duration: 3e3
              });
            }
          });
        });
      };
      const handleJoinActivity = (id) => {
        handleJoinClick(() => {
          formatAppLog("log", "at pages/community/community.vue:243", "报名活动，活动ID：", id);
          uni.showModal({
            title: "活动报名",
            content: "确认报名该社区活动吗？",
            confirmText: "确认报名",
            cancelText: "取消",
            success: (res) => {
              if (res.confirm) {
                const activity = activityList.value.find((item) => item.id === id);
                if (activity)
                  activity.joinNum += 1;
                uni.showToast({
                  title: "报名成功，敬请参与",
                  icon: "success",
                  duration: 2e3
                });
              }
            }
          });
        });
      };
      const __returned__ = { isScroll, isClick, scrollViewHeight, activeCate, joinClick, cateList, activityList, onScroll, handleFunctionClick: handleFunctionClick2, handleJoinClick, switchCate, gotoSearch, gotoActivityDetail, handleJoinActivity, ref: vue.ref, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-community" }, [
      vue.createElementVNode("view", { class: "status-bar-placeholder" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["page-header", { "header-scroll": $setup.isScroll }])
        },
        [
          vue.createElementVNode("text", { class: "header-title" }, "社区活动"),
          vue.createElementVNode("view", { class: "header-placeholder" })
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScroll: $setup.onScroll,
          "scroll-with-animation": "",
          style: vue.normalizeStyle({ height: $setup.scrollViewHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "search-bar" }, [
            vue.createElementVNode("view", {
              class: "search-input",
              onClick: $setup.gotoSearch
            }, [
              vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
              vue.createElementVNode("text", { class: "search-placeholder" }, "搜索社区活动/主题")
            ])
          ]),
          vue.createElementVNode("view", { class: "category-tab" }, [
            vue.createElementVNode("scroll-view", {
              "scroll-x": "",
              class: "tab-scroll",
              "show-scrollbar": "false"
            }, [
              vue.createElementVNode("view", { class: "tab-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.cateList, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: vue.normalizeClass(["tab-item", { "tab-active": $setup.activeCate === index }]),
                      key: index,
                      onClick: ($event) => $setup.switchCate(index)
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "tab-text" },
                        vue.toDisplayString(item),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "activity-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.activityList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: vue.normalizeClass(["activity-item", { "item-active": $setup.isClick }]),
                  key: index,
                  onClick: ($event) => $setup.gotoActivityDetail(item.id)
                }, [
                  vue.createElementVNode("view", { class: "activity-img-box" }, [
                    vue.createElementVNode("image", {
                      class: "activity-img",
                      src: item.cover,
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    item.tag ? (vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: 0,
                        class: "activity-tag"
                      },
                      vue.toDisplayString(item.tag),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true)
                  ]),
                  vue.createElementVNode("view", { class: "activity-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "activity-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "activity-meta" }, [
                      vue.createElementVNode("view", { class: "meta-item" }, [
                        vue.createElementVNode("text", { class: "meta-icon" }, "📅"),
                        vue.createElementVNode(
                          "text",
                          { class: "meta-text" },
                          vue.toDisplayString(item.time),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "meta-item" }, [
                        vue.createElementVNode("text", { class: "meta-icon" }, "📍"),
                        vue.createElementVNode(
                          "text",
                          { class: "meta-text" },
                          vue.toDisplayString(item.address),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "activity-extra" }, [
                      vue.createElementVNode("view", { class: "join-info" }, [
                        vue.createElementVNode("text", { class: "join-icon" }, "👥"),
                        vue.createElementVNode(
                          "text",
                          { class: "join-text" },
                          vue.toDisplayString(item.joinNum) + "人已报名",
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("button", {
                        class: "join-btn",
                        onClick: vue.withModifiers(($event) => $setup.handleJoinActivity(item.id), ["stop"])
                      }, "立即报名", 8, ["onClick"])
                    ])
                  ])
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          $setup.activityList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-box"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "📃"),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无相关社区活动，敬请期待")
          ])) : vue.createCommentVNode("v-if", true)
        ],
        36
        /* STYLE, NEED_HYDRATION */
      )
    ]);
  }
  const PagesCommunityCommunity = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-a6ef5318"], ["__file", "C:/Users/Lenovo/Desktop/hk/test/pages/community/community.vue"]]);
  __definePage("pages/auth/auth", PagesAuthAuth);
  __definePage("pages/device/device", PagesDeviceDevice);
  __definePage("pages/health/health", PagesHealthHealth);
  __definePage("pages/interact/interact", PagesInteractInteract);
  __definePage("pages/notifications/notifications", PagesNotificationsNotifications);
  __definePage("pages/mine/mine", PagesMineMine);
  __definePage("pages/location/location", PagesLocationLocation);
  __definePage("pages/video-detail/video-detail", PagesVideoDetailVideoDetail);
  __definePage("pages/medicine/medicine", PagesMedicineMedicine);
  __definePage("pages/environment/environment", PagesEnvironmentEnvironment);
  __definePage("pages/device-manage/device-manage", PagesDeviceManageDeviceManage);
  __definePage("pages/setting/setting", PagesSettingSetting);
  __definePage("pages/medicine/add-medicine", PagesMedicineAddMedicine);
  __definePage("pages/community/community", PagesCommunityCommunity);
  const _sfc_main = {
    __name: "App",
    setup(__props, { expose: __expose }) {
      __expose();
      vue.onLaunch(() => {
        formatAppLog("log", "at App.vue:12", "App 启动");
      });
      const __returned__ = { onLaunch: vue.onLaunch };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_router_view = vue.resolveComponent("router-view");
    return vue.openBlock(), vue.createElementBlock("view", { class: "app" }, [
      vue.createVNode(_component_router_view)
    ]);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/Lenovo/Desktop/hk/test/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
