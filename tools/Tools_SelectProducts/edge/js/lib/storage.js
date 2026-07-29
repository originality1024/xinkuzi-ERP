/**
 * Chrome扩展存储工具类
 * 使用 chrome.storage.local 进行设置数据的持久化存储
 */

const Storage = {
    // 默认设置值
    DEFAULT_SETTINGS: {
        // 重量冗余设置
        weightRedundancyMode: 'fixed', // 'ratio' | 'fixed'
        weightRedundancyRatio: 10,
        weightRedundancyFixed: 50,
        
        // 尺寸冗余设置
        lengthRedundancy: 5,
        widthRedundancy: 5,
        heightRedundancy: 5,
        
        // 成本冗余设置
        costRedundancyMode: 'fixed', // 'ratio' | 'fixed'
        costRedundancyRatio: 5,
        costRedundancyFixed: 5,

        // 体积重计算参数
        volumeWeightDivisor: 8000, // 体积重计算公式：长*宽*高/divisor

        // 快捷键设置
        shortcuts: {
            openPopup: 'Alt+1', // 打开主窗口
            openMiniPopup: 'Alt+2' // 打开小窗
        },

        // 尺寸限制设置
        sizeLimits: {
            france: {
                maxLength: 60, // 最长边限制 (cm)
                minMaxLength: 15, // 最长边最小 (cm)
                minMidLength: 10, // 次长边最小 (cm)
                maxSum: 90 // 长+宽+高限制 (cm)
            },
            uk: {
                // 0-2KG 主要地区
                '0-2kg': {
                    maxLength: 60, // 最长边限制 (cm)
                    minMaxLength: 21, // 最长边最小 (cm)
                    minMidLength: 10, // 次长边最小 (cm)
                    maxLengthLimit: 60, // 三边长度限制-长 (cm)
                    maxWidthLimit: 40, // 三边长度限制-宽 (cm)
                    maxHeightLimit: 40, // 三边长度限制-高 (cm)
                    maxVolume: 0.04 // 体积限制 (m³)
                },
                // 2-15KG 主要地区
                '2-15kg': {
                    maxLength: 120, // 最长边限制 (cm)
                    minMaxLength: 21, // 最长边最小 (cm)
                    minMidLength: 10, // 次长边最小 (cm)
                    maxSum: 150, // 长+宽+高限制 (cm)
                    maxVolume: 0.04 // 体积限制 (m³)
                }
            }
        },

        // 汇率设置
        eurRate: 7.7,
        gbpRate: 9,
        
        // 运费模板设置
        shippingTemplates: {
            france: [
                { min: 0, max: 0.2, registrationFee: 20, shippingFee: 79, otherFee: 25.5 },
                { min: 0.2, max: 0.5, registrationFee: 20, shippingFee: 79, otherFee: 25.5 },
                { min: 0.5, max: 30, registrationFee: 23, shippingFee: 75, otherFee: 25.5 }
            ],
            uk: [
                { min: 0, max: 2, registrationFee: 16, shippingFee: 66, otherFee: 1.5 },
                { min: 2, max: 15, registrationFee: 16, shippingFee: 66, otherFee: 1.5 },
            ]
        },
        
        // 权重设置
        weights: {
            shippingMethod: 5,
            rating: 10,
            ratingCount: 5,
            listingTime: 5,
            monthlySales: 15,
            deliveryTime: 10,
            supplyCount: 5,
            impressionScore: 5,
            estimatedAdFee: 10,
            competition: 15,
            volumeWeight: 5,
            pricePotential: 10,
            differentiation: 0
        }
    },

    // 将chrome.storage回调转为Promise
    _chromeStorageGet(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result);
                }
            });
        });
    },

    _chromeStorageSet(obj) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(obj, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    },

    _chromeStorageRemove(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove(key, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    },

    /**
     * 获取所有设置
     * @returns {Promise<Object>} 设置对象
     */
    async getSettings() {
        try {
            const result = await this._chromeStorageGet('settings');
            const savedSettings = result.settings || {};
            
            // 合并默认值和存储的值，确保新增的设置项有默认值
            const mergedSettings = { ...this.DEFAULT_SETTINGS, ...savedSettings };
            
            // 深层合并尺寸限制设置，确保新增的字段有默认值
            if (savedSettings.sizeLimits) {
                mergedSettings.sizeLimits = { ...this.DEFAULT_SETTINGS.sizeLimits };
                
                // 合并法国尺寸限制
                if (savedSettings.sizeLimits.france) {
                    mergedSettings.sizeLimits.france = {
                        ...this.DEFAULT_SETTINGS.sizeLimits.france,
                        ...savedSettings.sizeLimits.france
                    };
                }
                
                // 合并英国尺寸限制
                if (savedSettings.sizeLimits.uk) {
                    mergedSettings.sizeLimits.uk = { ...this.DEFAULT_SETTINGS.sizeLimits.uk };
                    
                    if (savedSettings.sizeLimits.uk['0-2kg']) {
                        mergedSettings.sizeLimits.uk['0-2kg'] = {
                            ...this.DEFAULT_SETTINGS.sizeLimits.uk['0-2kg'],
                            ...savedSettings.sizeLimits.uk['0-2kg']
                        };
                    }
                    
                    if (savedSettings.sizeLimits.uk['2-15kg']) {
                        mergedSettings.sizeLimits.uk['2-15kg'] = {
                            ...this.DEFAULT_SETTINGS.sizeLimits.uk['2-15kg'],
                            ...savedSettings.sizeLimits.uk['2-15kg']
                        };
                    }
                }
            }
            
            return mergedSettings;
        } catch (error) {
            console.error('获取设置失败:', error);
            return { ...this.DEFAULT_SETTINGS };
        }
    },

    /**
     * 保存所有设置
     * @param {Object} settings - 设置对象
     * @returns {Promise<void>}
     */
    async saveSettings(settings) {
        try {
            await this._chromeStorageSet({ settings });
        } catch (error) {
            console.error('保存设置失败:', error);
            throw error;
        }
    },

    /**
     * 获取单个设置项
     * @param {string} key - 设置项键名
     * @returns {Promise<any>} 设置值
     */
    async getSetting(key) {
        const settings = await this.getSettings();
        return settings[key];
    },

    /**
     * 更新单个设置项
     * @param {string} key - 设置项键名
     * @param {any} value - 设置值
     * @returns {Promise<void>}
     */
    async updateSetting(key, value) {
        const settings = await this.getSettings();
        settings[key] = value;
        await this.saveSettings(settings);
    },

    /**
     * 重置为默认设置
     * @returns {Promise<void>}
     */
    async resetSettings() {
        try {
            await this._chromeStorageRemove('settings');
        } catch (error) {
            console.error('重置设置失败:', error);
            throw error;
        }
    },

    /**
     * 获取当前选中的运费模板
     * @param {string} country - 国家代码 'france' | 'uk'
     * @returns {Promise<Array>} 运费模板数组
     */
    async getShippingTemplate(country) {
        const settings = await this.getSettings();
        return settings.shippingTemplates[country] || [];
    },

    /**
     * 获取当前使用的汇率
     * @param {string} currency - 货币类型 'eur' | 'gbp'
     * @returns {Promise<number>} 汇率值
     */
    async getExchangeRate(currency) {
        const settings = await this.getSettings();
        return currency === 'eur' ? settings.eurRate : settings.gbpRate;
    }
};