import os
import re
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from google import genai
from lunardate import LunarDate
import logging
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMService:
    def __init__(self):
        # 强制重新加载环境变量
        load_dotenv()
        
        # 获取 API 密钥，并添加详细调试
        self.api_key = os.getenv('GEMINI_API_KEY', '')
        all_env_vars = dict(os.environ)
        gemini_keys = {k: v for k, v in all_env_vars.items() if 'GEMINI' in k.upper()}
        
        logger.info(f"=== LLM 服务初始化调试 ===")
        logger.info(f"环境变量总数: {len(all_env_vars)}")
        logger.info(f"包含 GEMINI 的环境变量: {gemini_keys}")
        logger.info(f"GEMINI_API_KEY 原始值: {repr(os.getenv('GEMINI_API_KEY'))}")
        logger.info(f"GEMINI_API_KEY 值: {'已设置' if self.api_key else '未设置'}")
        if self.api_key:
            logger.info(f"API Key 长度: {len(self.api_key)}")
            logger.info(f"API Key 前缀: {self.api_key[:15]}...")
            logger.info(f"API Key 包含空格: {'是' if ' ' in self.api_key else '否'}")
            newline_char = '\n'
            logger.info(f"API Key 包含换行: {'是' if newline_char in self.api_key else '否'}")
        
        # 检查是否在 Render 环境
        is_render = os.getenv('RENDER') == 'true' or 'onrender.com' in os.getenv('RENDER_EXTERNAL_URL', '')
        logger.info(f"运行环境: {'Render' if is_render else '本地'}")
        logger.info("=== 调试信息结束 ===")
        
        if not self.api_key:
            logger.warning("GEMINI_API_KEY 环境变量未设置，将使用默认占卜结果")
            self.client = None
        else:
            try:
                # 使用新的 google-genai SDK，显式传入 API 密钥
                self.client = genai.Client(api_key=self.api_key)
                logger.info("LLM 客户端初始化成功")
            except Exception as error:
                logger.error(f"初始化 LLM 客户端失败: {error}")
                self.client = None
        
        # 六神配置
        self.hexagrams = [
            {"name": "大安", "element": "木", "meaning": "事事如意，心想事成", "luck": 9},
            {"name": "留连", "element": "土", "meaning": "需要耐心等待，时机未到", "luck": 6},
            {"name": "速喜", "element": "火", "meaning": "好事将至，喜事临门", "luck": 8},
            {"name": "赤口", "element": "金", "meaning": "需要谨慎言行，避免冲突", "luck": 4},
            {"name": "小吉", "element": "水", "meaning": "小有收获，稳中求进", "luck": 7},
            {"name": "空亡", "element": "土", "meaning": "暂时困顿，需要调整方向", "luck": 3}
        ]
        # 六神拼音（英文，按字分隔，全部小写）
        self.hexagram_pinyin = {
            "大安": "da an",
            "留连": "liu lian",
            "速喜": "su xi",
            "赤口": "chi kou",
            "小吉": "xiao ji",
            "空亡": "kong wang",
        }

    def luck_to_text(self, luck: int) -> str:
        """将 luck 数值转换为吉凶文本"""
        if luck >= 9:
            return "大吉"
        if luck >= 8:
            return "中吉"
        if luck >= 7:
            return "小吉"
        if luck >= 6:
            return "平吉"
        if luck >= 4:
            return "小凶"
        return "大凶"

    def compute_palaces(self, numbers: List[int]) -> List[Dict]:
        """根据三个数字计算人/事/应三宫的六神信息（含拼音）"""
        positions = ["ren", "shi", "ying"]
        palaces = []
        for idx, n in enumerate(numbers[:3]):
            remainder = n % 6
            # 余数为0 视为第6宫
            index = 5 if remainder == 0 else (remainder - 1)
            info = self.hexagrams[index]
            name = info["name"]
            palaces.append({
                "name": name,
                "pinyin": self.hexagram_pinyin.get(name, ""),
                "element": info["element"],
                "position": positions[idx],
            })
        return palaces

    async def perform_divination(self, wish: str, numbers: List[int], language: str = 'zh') -> Dict:
        """执行小六壬占卜"""
        # 如果没有 API 客户端，直接返回默认结果
        if not self.client:
            logger.info("使用默认占卜结果（API 客户端未初始化）")
            return self.get_default_divination(wish, numbers, language=language)
            
        try:
            logger.info(f"开始调用 LLM API 进行占卜：愿望='{wish}', 数字={numbers}")
            prompt = self.build_divination_prompt(wish, numbers, language=language)
            
            if language == 'en':
                system_prompt = (
                    "You are an AI divination analyst specialized in the ‘Three Palaces Five Elements’ method. "
                    "Your only task is to take three numbers (1–99) and a concrete wish, "
                    "apply the traditional Chinese Xiao Liu Ren method to analyze, and output a structured, insightful report."
                )
            else:
                system_prompt = "你是一位精通「三宫五行法」的AI术数分析师。你的**唯一任务**是接收用户提供的**三个1-99之间的数字**和**一个具体的愿望**，运用中国古代的小六壬「三宫五行占算法」来进行测算，进而给出与财富、运势等相关的结果和建议,进行深度分析，并输出一份结构化的、富有洞见的解读报告。"
            full_prompt = f"{system_prompt}\n\n{prompt}"
            
            response = self.client.models.generate_content(
                model="gemini-2.0-flash-lite",
                contents=full_prompt
            )

            logger.info("LLM API 调用成功，正在解析结果")
            result = response.text
            logger.info(f"AI 原始返回内容: {result}")
            parsed_result = self.parse_divination_result(result, language=language)
            # 增补结构化字段：luck_text、palaces（三宫）
            try:
                lv = int(parsed_result.get("luck", 7))
            except Exception:
                lv = 7
            # 若模型未提供，则补充本地计算
            if not parsed_result.get("luck_text"):
                parsed_result["luck_text"] = self.luck_to_text(lv)
            if not parsed_result.get("palaces"):
                parsed_result["palaces"] = self.compute_palaces(numbers)
            logger.info("LLM AI 占卜结果解析完成")
            logger.info(f"解析后的结果: {parsed_result}")
            return parsed_result
        
        except Exception as error:
            logger.error(f"LLM API 调用失败: {error}")
            logger.info("回退到默认占卜结果")
            return self.get_default_divination(wish, numbers, language=language)

    def build_divination_prompt(self, wish: str, numbers: List[int], language: str = 'zh') -> str:
        """构建占卜提示词（中英双语），要求产出可读分段 + 机器可读 JSON（含 luck_text, palaces）。

        注意：避免在包含大量花括号的多行字符串中使用 f-string，以免触发格式化错误。
        """
        if language == 'en':
            base = (
                """
#### 1) Role & Task

You are a Xiao Liu Ren divination analyst using the ‘Three Palaces Five Elements’ method. Your only task is to analyze three numbers (1–99) and a specific wish, outputting a structured analysis.

Key principles:
1. Use only the Three Palaces Five Elements algorithm.
2. Base insights on the provided knowledge base below.
3. Focus on relationships among Person (Ren), Matter (Shi), and Outcome (Ying).
4. Tie all analysis to the user's wish.

---

#### 2) Knowledge Base (Final)
Palaces: Da’an (Wood), Liulian (Earth), Suxi (Fire), Chikou (Metal), Xiaoji (Water), Kongwang (Earth)

Generating (sheng): Wood→Fire→Earth→Metal→Water→Wood
Overcoming (ke): Wood⊣Earth, Earth⊣Water, Water⊣Fire, Fire⊣Metal, Metal⊣Wood

---

#### 3) Output Format (Strict)

[Hexagram Analysis]
1) Person vs Matter: …
2) Person vs Outcome: …
3) Matter vs Outcome: …

[Prediction]
…

[Divine Guidance]
…

[Fortune Level]
Overall luck score (1–10)

Rules:
1) Follow the method strictly; 2) Tie to the wish; 3) Practical advice; 4) No emojis; 5) Avoid exact dates; 6) Do not return JSON; return plain text in the above sections.

Finally, after the readable sections, output a machine-readable JSON block in a fenced code block with language tag json. The JSON MUST follow this schema (lowercase keys only):
```
```json
{
  "divination": "...",
  "prediction": "...",
  "advice": "...",
  "luck": 1,
  "luck_text": "大吉|中吉|小吉|平吉|小凶|大凶",
  "palaces": [
    { "name": "大安|留连|速喜|赤口|小吉|空亡", "pinyin": "da an|liu lian|su xi|chi kou|xiao ji|kong wang", "element": "木|土|火|金|水|土", "position": "ren|shi|ying" },
    { "name": "...", "pinyin": "...", "element": "...", "position": "..." },
    { "name": "...", "pinyin": "...", "element": "...", "position": "..." }
  ]
}
```
Constraints for JSON:
- luck MUST be an integer 1–10; luck_text MUST be one of the six Chinese labels above.
- palaces MUST contain exactly three objects for person/matter/outcome with position in {ren, shi, ying}; pinyin is lowercase with spaces.
- No extra keys; no comments; ensure valid JSON.
"""
            )
            tail = f"\nUser wish: {wish}\nNumbers: {', '.join(map(str, numbers))}\n"
            return base + tail

        base = (
            """
#### **一、 核心角色与唯一任务**

你是一位精通小六壬"三宫五行占算法"的AI术数分析师。你的**唯一任务**是接收用户提供的**三个1-99之间的数字**和**一个具体的愿望**，运用此方法进行深度分析，给出与财富、运势等相关的结果和建议，并输出一份结构化的、富有洞见的解读报告。

**核心原则：**
1. **专注单一方法：** 你只使用"三数三宫占算法"进行运算。
2. **知识库锁定：** 你所有的解读，都**必须**严格来源于我为你设定的下述知识库。
3. **深度分析：** 分析的重点是【人】、【事】、【应】三宫之间的五行生克关系。
4. **情景关联：** 所有分析都必须紧密围绕用户提出的"愿望"展开。

---

#### **二、 核心知识库 (Finalized Knowledge Base)**

你必须将以下经过最终修正的六神信息，作为你永不改变的核心知识。

| 宫位 (Palace) | **最终五行** | **双重宫职** | **核心意象关键字** |
| :--- | :--- | :--- | :--- |
| **1. 大安** | **木** | 事业宫 / 命宫 | 稳定，安康，静守，青龙，正直，官贵 |
| **2. 留连** | **土** | 田宅宫 / 奴仆宫 | 迟滞，纠缠，阻碍，阴私，忧虑，占有 |
| **3. 速喜** | **火** | 感情宫 / 夫妻宫 | 迅速，喜讯，热恋，口舌，朱雀，文书 |
| **4. 赤口** | **金** | 疾厄宫 / 兄弟宫 | 官非，口舌，凶险，伤害，白虎，斗争 |
| **5. 小吉** | **水** | 驿马宫 / 子女宫 | 吉利，合作，财源，出行，六合，智慧 |
| **6. 空亡** | **土** | 福德宫 / 父母宫 | 落空，徒劳，无果，阴德，勾陈，玄奥 |

**五行生克关系：**
* **相生:** 木生火, 火生土, 土生金, 金生水, 水生木 (促进, 帮助)
* **相克:** 木克土, 土克水, 水克火, 火克金, 金克木 (克服, 压力)
* **比和:** 同五行 (和谐, 顺畅)

---

#### **三、 运算与分析框架**

##### **Step 1: 输入处理与定宫**
1. **获取输入：** 用户提供三个1-99的数字（数字A, B, C）和一个愿望。
2. **计算定宫：** 分别用每个数字对6取余数，来确定三个宫位。
   * 宫位A = 数字A % 6
   * 宫位B = 数字B % 6
   * 宫位C = 数字C % 6
   * **（重要规则：若余数为0，则计为第6宫【空亡】）**
3. **分配三宫：**
   * **【人宫】(用户本人):** 来自数字A，对应宫位A。
   * **【事宫】(事情本身):** 来自数字B，对应宫位B。
   * **【应宫】(最终结果):** 来自数字C，对应宫位C。

##### **Step 2: 五行生克分析**
1. **分析【人宫】与【事宫】的关系 (我与事):**
   * 人"生"事 (付出), 事"生"人 (得利), 人"克"事 (掌控), 事"克"人 (受阻), 人事"比和" (顺畅)。
2. **分析【人宫】与【应宫】的关系 (我与结果):**
   * 人"生"应 (耗费), 应"生"人 (圆满), 人"克"应 (可控), 应"克"人 (不利), 人应"比和" (如愿)。
3. **分析【事宫】与【应宫】的关系 (事与结果):**
   * 事"生"应 (事成), 应"生"事 (助缘), 事"克"应 (难成), 应"克"事 (受限), 事应"比和" (一致)。

---

#### **四、 标准化输出结构**

请按照以下格式回答：

【卦象解析】
1. **您与事情的关系 (人 vs 事):** [人宫五行]与[事宫五行]为**[生/克/比和]**关系，这代表：[进行情景化解释]。
2. **您与结果的关系 (人 vs 应):** [人宫五行]与[应宫五行]为**[生/克/比和]**关系，这代表：[进行情景化解释]。
3. **事情与结果的关系 (事 vs 应):** [事宫五行]与[应宫五行]为**[生/克/比和]**关系，这代表：[进行情景化解释]。

【运势预测】
[根据三宫五行分析，给出详细的运势判断和建议]

【神明指引】
[针对用户愿望和卦象结果，给出具体可行的建议]

【吉凶判断】
总体运势评分（1-10分）


**说明：**
1. 请严格按照三宫五行占算法进行分析
2. 分析需要紧密结合用户的具体愿望
3. 给出的建议要实用且有针对性
4. 保持传统文化的严肃性和神秘感
5. 不需要出现任何的数字，类如"数字A % 6"的分析过程
6. 不要出现任何的 emoji
7. 不要出现具体的任何数字的年月日，如果必须要有的话就只能有类似 "今年""明年""下个月"

请根据以上要求进行三宫五行占算分析，并给出完整的解读结果。
在上述可读分段之后，请追加一个机器可读的 JSON 代码块（使用 ```json 标记），严格遵循以下 schema，键名全部小写：
```
```json
{
  "divination": "...",
  "prediction": "...",
  "advice": "...",
  "luck": 1,
  "luck_text": "大吉|中吉|小吉|平吉|小凶|大凶",
  "palaces": [
    { "name": "大安|留连|速喜|赤口|小吉|空亡", "pinyin": "da an|liu lian|su xi|chi kou|xiao ji|kong wang", "element": "木|土|火|金|水|土", "position": "ren|shi|ying" },
    { "name": "...", "pinyin": "...", "element": "...", "position": "..." },
    { "name": "...", "pinyin": "...", "element": "...", "position": "..." }
  ]
}
```
JSON 约束：
- luck 必须是 1-10 的整数；luck_text 必须是「大吉/中吉/小吉/平吉/小凶/大凶」之一；
- palaces 必须且仅包含三项，分别对应人/事/应，position 仅允许 ren/shi/ying；pinyin 为小写、词间空格。
- 不得包含多余键；不得包含注释；必须是有效 JSON；字段为纯文本。
"""
        )
        tail = f"\n用户愿望：{wish}\n三个数字：{', '.join(map(str, numbers))}\n"
        return base + tail

    def parse_divination_result(self, result: str, language: str = 'zh') -> Dict:
        """解析占卜结果：优先解析 JSON，其次解析分段与 luck 文本"""
        try:
            # 1) 优先尝试解析 JSON 代码块
            json_data = self.extract_json_block(result)
            if json_data:
                divination = str(json_data.get("divination", "")).strip()
                prediction = str(json_data.get("prediction", "")).strip()
                advice = str(json_data.get("advice", "")).strip()
                try:
                    luck_val = int(json_data.get("luck", 7))
                except Exception:
                    luck_val = 7
                luck_val = max(1, min(10, luck_val))

                # 可选字段：luck_text / palaces（若存在则透传）
                luck_text = str(json_data.get("luck_text", "")).strip() or None
                palaces = json_data.get("palaces") if isinstance(json_data.get("palaces"), list) else None

                return {
                    "success": True,
                    "divination": divination,
                    "prediction": prediction,
                    "advice": advice,
                    "luck": luck_val,
                    **({"luck_text": luck_text} if luck_text else {}),
                    **({"palaces": palaces} if palaces else {}),
                    "full_text": result
                }

            # 2) 正常解析可读分段
            div_keys = ["【卦象解析】", "[Hexagram Analysis]", "Hexagram Analysis"]
            pre_keys = ["【运势预测】", "[Prediction]", "Prediction"]
            adv_keys = ["【神明指引】", "[Divine Guidance]", "Divine Guidance"]

            sections = {
                "divination": self.extract_section(result, div_keys),
                "prediction": self.extract_section(result, pre_keys),
                "advice": self.extract_section(result, adv_keys),
                "luck": self.extract_luck_score(result)
            }

            return {
                "success": True,
                **sections,
                "full_text": result
            }
        except Exception as error:
            logger.error(f"解析占卜结果失败: {error}")
            return {
                "success": False,
                "error": "解析结果失败"
            }

    def extract_section(self, text: str, section_title) -> str:
        """提取文本段落，支持单个或多个标题（中/英）"""
        titles = section_title if isinstance(section_title, (list, tuple)) else [section_title]
        for title in titles:
            # 允许中文【】或英文[]或无括号
            escaped = re.escape(title).replace("\\[", "[[]").replace("\\]", "[]]")
            pattern = rf"{escaped}([\s\S]*?)(?=【|\[|$)"
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return ""

    def extract_luck_score(self, text: str) -> int:
        """提取运势评分（更鲁棒）：支持 /10、分、score、rating、luck 等关键词，允许小数取整"""
        patterns = [
            r"(?:overall\s*)?(?:score|rating|luck)[^\d]{0,10}(\d{1,2})(?:\s*/\s*10)?",  # overall score: 7/10
            r"(\d{1,2})\s*/\s*10",                                                   # 7/10
            r"(\d{1,2})\s*分"                                                           # 7分
        ]
        for pat in patterns:
            m = re.search(pat, text, flags=re.IGNORECASE)
            if m:
                try:
                    val = int(m.group(1))
                    return max(1, min(10, val))
                except Exception:
                    continue
        # 小数形式 6.5/10
        m = re.search(r"(\d+(?:\.\d+)?)\s*/\s*10", text)
        if m:
            try:
                val = int(round(float(m.group(1))))
                return max(1, min(10, val))
            except Exception:
                pass
        return 7

    def extract_json_block(self, text: str) -> Optional[Dict]:
        """从文本中提取 JSON（优先 ```json 代码块; 其次第一个花括号对象）"""
        import json
        # 优先三引号 json 代码块
        fence = re.search(r"```json\s*([\s\S]*?)```", text, flags=re.IGNORECASE)
        if fence:
            try:
                return json.loads(fence.group(1).strip())
            except Exception:
                pass
        # 次选：第一个大括号对象（尽量不贪婪）
        brace = re.search(r"\{[\s\S]*\}", text)
        if brace:
            blob = brace.group(0)
            # 尝试限制为只包含我们关心的四个键，移除可能的结尾多余字符
            try:
                data = json.loads(blob)
                if isinstance(data, dict) and any(k in data for k in ("divination","prediction","advice","luck")):
                    return data
            except Exception:
                pass
        return None

    def get_default_divination(self, wish: str, numbers: List[int], language: str = 'zh') -> Dict:
        """获取默认占卜结果（当API失败时使用, 中英）"""
        num1, num2, num3 = numbers
        sum_numbers = sum(numbers)
        remainder = sum_numbers % 6
        
        hexagram = self.hexagrams[remainder]
        palaces = self.compute_palaces(numbers)
        luck_text = self.luck_to_text(hexagram['luck'])
        if language == 'en':
            return {
                "success": True,
                "divination": f"Based on your numbers {num1}, {num2}, {num3}, the hexagram indicates '{hexagram['name']}'. It suggests: {hexagram['meaning']}.",
                "prediction": f"Regarding your wish '{wish}', {self.generate_prediction_en(hexagram['luck'])}",
                "advice": f"Divine guidance: {self.generate_advice_en(hexagram['luck'])}",
                "luck": hexagram['luck'],
                "luck_text": luck_text,
                "palaces": palaces,
                "full_text": (
                    f"[Hexagram Analysis]\nBased on your numbers {num1}, {num2}, {num3}, the hexagram indicates '{hexagram['name']}'.\n\n"
                    f"[Prediction]\n{self.generate_prediction_en(hexagram['luck'])}\n\n"
                    f"[Divine Guidance]\n{self.generate_advice_en(hexagram['luck'])}\n\n"
                    f"[Fortune Level]\nOverall score: {hexagram['luck']}/10"
                )
            }
        else:
            return {
                "success": True,
                "divination": f"根据您选择的数字 {num1}、{num2}、{num3}，推算得出「{hexagram['name']}」卦象。此卦象预示着{hexagram['meaning']}。",
                "prediction": f"您的愿望「{wish}」在当前时运下，{self.generate_prediction(hexagram['luck'])}",
                "advice": f"神明指引：{self.generate_advice(hexagram['luck'])}",
                "luck": hexagram['luck'],
                "luck_text": luck_text,
                "palaces": palaces,
                "full_text": f"【卦象解析】\n根据您选择的数字 {num1}、{num2}、{num3}，推算得出「{hexagram['name']}」卦象。\n\n【运势预测】\n您的愿望在当前时运下，{self.generate_prediction(hexagram['luck'])}\n\n【神明指引】\n{self.generate_advice(hexagram['luck'])}\n\n【吉凶判断】\n总体运势评分：{hexagram['luck']}/10分"
            }

    def generate_prediction_en(self, luck: int) -> str:
        if luck >= 8:
            return "high likelihood of success; timing is ripe to act."
        elif luck >= 6:
            return "some chance of success; patience is needed until timing aligns."
        elif luck >= 4:
            return "challenges present; proceed cautiously and adjust strategy."
        else:
            return "significant headwinds; pause plans and seek alternatives."

    def generate_advice_en(self, luck: int) -> str:
        if luck >= 8:
            return "Stay sincere and kind; continued good deeds will bring fulfillment."
        elif luck >= 6:
            return "Be patient and steady; keep making efforts as timing matures."
        elif luck >= 4:
            return "Adjust mindset and resolve obstacles; prayers/incense may help."
        else:
            return "Low fortune currently; do good deeds and wait for a turn of luck."

    def generate_prediction(self, luck: int) -> str:
        """生成预测文本"""
        if luck >= 8:
            return "实现的可能性很高，时机已经成熟，可以积极行动。"
        elif luck >= 6:
            return "有一定的实现可能，需要耐心等待合适的时机。"
        elif luck >= 4:
            return "面临一些挑战，需要谨慎处理，调整策略。"
        else:
            return "当前阻力较大，建议暂缓行动，寻求其他途径。"

    def generate_advice(self, luck: int) -> str:
        """生成建议文本"""
        if luck >= 8:
            return "诚心祈福，保持善念，您的愿望将会实现。建议多行善事，积累福德。"
        elif luck >= 6:
            return "保持耐心，坚持努力，时机成熟时自然水到渠成。建议多烧香祈福。"
        elif luck >= 4:
            return "需要调整心态，化解阻碍，可通过上香祈福来改善运势。"
        else:
            return "当前运势低迷，建议多行善事，上香祈福，等待时机转变。"

    async def get_daily_fortune(self, date: Optional[datetime] = None) -> Dict:
        """获取每日运势"""
        try:
            target_date = date or datetime.now()
            date_string = target_date.strftime('%Y年%m月%d日')
            
            # 获取农历日期
            try:
                lunar = LunarDate.fromSolarDate(target_date.year, target_date.month, target_date.day)
                lunar_date = f"{lunar.month}月{lunar.day}日"
            except:
                lunar_date = "农历吉日"
            
            prompt = f"""请根据今天的日期生成当日的运势情况。今天是{date_string}，农历{lunar_date}。

请基于传统的中华民俗文化和五行理论，生成今日运势报告，包含以下方面：
1. 总体运势评级（1-5星）
2. 财运分析
3. 事业运势
4. 感情运势
5. 健康运势
6. 今日建议
7. 幸运数字
8. 幸运颜色
9. 宜做的事情
10. 忌做的事情

请严格按照以下格式输出：

黄道吉日
{date_string}
{lunar_date} [吉/平/凶]
宜 [具体事项，用空格分隔]
忌 [具体事项，用空格分隔]

财运★★★★★
[财运分析内容]

事业★★★★☆
[事业运势内容]

感情★★★★☆
[感情运势内容]

健康★★★★★
[健康运势内容]

今日建议
[具体建议内容]

今日幸运
幸运颜色: [颜色]
幸运数字: [数字1], [数字2], [数字3]
幸运方位: [方位]
吉时: [时间段]

请用传统的中式语言风格，保持庄重和神秘感。"""

            system_prompt = "你是一位精通中国传统命理学的大师，擅长根据日期和农历信息提供详细的运势分析。请严格按照用户要求的格式输出，保持传统文化的庄重感。"
            full_prompt = f"{system_prompt}\n\n{prompt}"
            
            response = self.client.models.generate_content(
                model="gemini-2.0-flash-lite",
                contents=full_prompt
            )

            return {
                "success": True,
                "fortune": response.text,
                "date": date_string,
                "lunar_date": lunar_date
            }
        except Exception as error:
            logger.error(f"获取每日运势失败: {error}")
            
            # 默认运势内容
            target_date = date or datetime.now()
            date_string = target_date.strftime('%Y年%m月%d日')
            default_fortune = f"""黄道吉日
{date_string}
农历吉日 吉
宜 祈福上香 拜访长辈 整理房间
忌 冲动购物 与人争执 过度饮食

财运★★★★☆
财运平稳，有小额收入机会，宜谨慎理财。

事业★★★★☆
工作运势良好，适合推进重要项目，与同事关系和谐。

感情★★★★☆
感情运势平稳，单身者宜多参加社交活动。

健康★★★★★
身体状况良好，注意作息规律和饮食平衡。

今日建议
多行善事，保持善念，诚心祈福，福运自然来临。

今日幸运
幸运颜色: 金色
幸运数字: 8, 18, 28
幸运方位: 东南
吉时: 09:00-11:00"""

            return {
                "success": False,
                "fortune": default_fortune,
                "date": date_string,
                "lunar_date": "农历吉日"
            }

    def get_daily_fortune_cache_key(self, date: Optional[datetime] = None) -> str:
        """生成缓存键"""
        target_date = date or datetime.now()
        return f"dailyFortune_{target_date.year}_{target_date.month}_{target_date.day}"


# 创建单例实例
llm_service = LLMService()
