# 01 - 课程简介

本课程将从 0 到 1 构建"固定年化金库 + 奖励代币"的教学项目，覆盖合约、脚本、前端与测试。你将掌握 ERC4626 规范、线性计息与奖励发放、Hardhat 与前端集成等核心技能。

## DApp vs 传统 App 全方位对比

在深入学习之前，让我们先了解去中心化应用（DApp）与传统应用的根本差异：

### 架构对比

```mermaid
graph TB
    subgraph "传统 App 架构"
        U1[用户] --> F1[前端 Web/Mobile]
        F1 --> A1[API 服务器]
        A1 --> DB1[(中心化数据库)]
        A1 --> PS1[第三方支付服务]
        A1 --> AU1[用户认证服务]
    end
    
    subgraph "DApp 架构"
        U2[用户] --> F2[前端 Web/Mobile]
        F2 --> W[钱包 Wallet]
        W --> B[区块链网络]
        B --> SC[智能合约]
        SC --> DS[(分布式存储)]
    end
```

### 核心差异对比

| 维度 | 传统 App | DApp |
|------|----------|------|
| **数据存储** | 中心化数据库 | 区块链 + 分布式存储 |
| **用户认证** | 用户名密码/OAuth | 钱包私钥签名 |
| **数据所有权** | 平台拥有 | 用户拥有 |
| **服务可用性** | 依赖服务商 | 去中心化，抗审查 |
| **交易结算** | 依赖银行/支付平台 | 直接链上结算 |
| **开发复杂度** | 相对简单 | 需要区块链知识 |
| **用户体验** | 流畅 | 需要确认交易，有Gas费 |
| **可编程性** | 有限 | 智能合约可编程货币 |

### 交互流程对比

```mermaid
sequenceDiagram
    participant User as 用户
    participant Frontend as 前端
    participant Backend as 后端/合约
    participant Storage as 存储

    Note over User, Storage: 传统 App 流程
    User->>Frontend: 登录(用户名密码)
    Frontend->>Backend: API 请求
    Backend->>Storage: 数据库操作
    Storage-->>Backend: 返回结果
    Backend-->>Frontend: API 响应
    Frontend-->>User: 显示结果

    Note over User, Storage: DApp 流程  
    User->>Frontend: 连接钱包
    Frontend->>Backend: 调用智能合约
    Note over Backend: 钱包签名验证
    Backend->>Storage: 链上状态变更
    Storage-->>Backend: 交易确认
    Backend-->>Frontend: 事件/状态更新
    Frontend-->>User: 显示结果
```

### 支付与结算对比

```mermaid
flowchart TD
    subgraph "传统支付流程"
        P1[用户发起支付] --> P2[支付网关]
        P2 --> P3[银行系统]
        P3 --> P4[结算中心]
        P4 --> P5[商户账户]
        P6[手续费: 2-3%] --> P7[结算周期: T+1/T+3]
    end
    
    subgraph "区块链支付流程"
        C1[用户发起交易] --> C2[钱包签名]
        C2 --> C3[广播到网络]
        C3 --> C4[矿工/验证者确认]
        C4 --> C5[直接到账]
        C6[Gas费: $1-50] --> C7[确认时间: 秒级-分钟级]
    end
```

### 信任模型对比

```mermaid
graph LR
    subgraph "传统 App 信任链"
        T1[用户] --> T2[平台]
        T2 --> T3[银行]
        T3 --> T4[监管机构]
        T4 --> T5[政府]
        T6[信任成本: 高] --> T7[单点故障风险]
    end
    
    subgraph "DApp 信任模型"
        D1[用户] --> D2[代码/数学]
        D2 --> D3[共识机制]
        D3 --> D4[密码学]
        D5[信任成本: 低] --> D6[去中心化容错]
    end
```

### 我们的项目定位

本课程构建的固定年化金库项目体现了 DApp 的核心优势：

- **透明性**: 利率计算逻辑完全开源
- **去信任**: 无需信任平台，代码即法律
- **可编程**: 智能合约自动执行奖励发放
- **资产自主权**: 用户完全控制自己的资产

## 项目核心流程

```mermaid
graph TD
  A[用户] -->|Deposit| B[Vault]
  B -->|Mint| C[RewardToken]
  B --> D[Underlying Asset]
  A-->|Claim| C
  A-->|Withdraw| D
```

通过本课程，你将亲手体验从传统开发思维向 Web3 开发思维的转变！