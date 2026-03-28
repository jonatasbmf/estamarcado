https://brasil.uxdesign.cc/o-segredo-para-criar-paletas-neutras-coloridas-9be22fe0ae55

O artigo mencionado de Pablo Figueiredo ensina que o segredo de uma paleta neutra "viva" é **não utilizar cinzas puros** (acromáticos), mas sim injetar uma pequena porcentagem da sua cor principal (neste caso, o **Azul**) nos tons de cinza.

Isso cria uma harmonia visual superior, pois os neutros parecem pertencer à mesma família da cor de destaque. Abaixo, aplico essa lógica para criar uma paleta de **Azul e Cinzas Azulados**, equilibrando brilho e saturação.

### 1. A Cor de Destaque (Primary Blue)
Esta é a cor que guiará a "alma" da sua paleta neutra.
* **Azul Principal:** `#2563EB` (Um azul vibrante e profissional)

---

### 2. Paleta Neutra (Cinzas com "DNA" Azul)
Seguindo o artigo, aumentamos a saturação nos tons escuros e a reduzimos nos tons claros para manter a naturalidade.

| Tom | Uso Sugerido | Hexadecimal | Descrição |
| :--- | :--- | :--- | :--- |
| **N-900** | Texto Principal / Títulos | `#0F172A` | Azul marinho quase preto, muito profundo. |
| **N-700** | Texto Secundário | `#334155` | Cinza ardósia escuro com nuances azuis. |
| **N-500** | Ícones / Bordas Fortes | `#64748B` | O "Cinza Médio" perfeito, equilibrado. |
| **N-300** | Bordas / Divisores | `#CBD5E1` | Cinza azulado claro para separação de áreas. |
| **N-100** | Fundo de Cards / Hover | `#F1F5F9` | Cinza gelo, quase branco, mas nitidamente azul. |
| **N-50** | Fundo de Tela (Light Mode) | `#F8FAFC` | O neutro mais claro para grandes áreas. |

---

### 3. Aplicação no Sistema (Exemplos)

#### **Modo Light (Claro)**
* **Fundo Geral:** `#F8FAFC` (N-50)
* **Cards/Superfícies:** `#FFFFFF` (Branco Puro)
* **Bordas:** `#E2E8F0` (N-200)
* **Texto Principal:** `#0F172A` (N-900)
* **Botão Primário:** `#2563EB` (Azul Principal) com texto `#FFFFFF`

#### **Modo Dark (Escuro)**
* **Fundo Geral:** `#0F172A` (N-900)
* **Cards/Superfícies:** `#1E293B` (Um tom entre N-800 e N-900)
* **Texto Principal:** `#F1F5F9` (N-100)
* **Texto de Apoio:** `#94A3B8` (N-400)
* **Destaque (Ação):** `#3B82F6` (Um azul um pouco mais claro para contraste no escuro)

### Por que isso funciona?
Se você usasse um cinza puro (ex: `#333333`), ao lado do seu azul, ele pareceria "sujo" ou amarelado por contraste simultâneo. Ao usar o `#334155` (que tem azul na composição), a interface ganha uma **unidade visual** que passa uma percepção de maior qualidade e cuidado no design.

Nome na Imagem  Código Hex	Uso Sugerido no Sistema
Blue-950	#172554	Fundo de Títulos profundos em Modo Dark.
Blue-900	#1E3A8A	Estado de Foco (Focus) em elementos escuros.
Blue-800	#1E40AF	Estado Ativo (Active) de botões/links no Modo Dark.
Blue-700	#1D4ED8	Estado de Hover de botões primários no Modo Dark.
Blue-600	#2563EB	Ação Principal (Primary) no Modo Light. (Original)
Blue-500	#3B82F6	Ação Principal no Modo Dark. (Original)
Blue-400	#60A5FA	Destaque em infográficos ou texto de apoio claro.
Blue-300	#93C5FD	Bordas de foco (Focus ring) ou estado Disabled ativo.
Blue-200	#BFDBFE	Fundo de componentes gráficos suaves.
Blue-100	#DBEAFE	Fundo de Alertas (Info) ou Tooltips claros.
Blue-50 	#EFF6FF	"Fundo super suave	 alternativo ao cinza N-50."

O Gemini disse
Entendido. Para criar uma paleta de sistema completa, precisamos não apenas dos cinzas neutros "injetados" com azul, mas de uma escala monocromática do próprio Azul para usar em diferentes estados de interação (hover, active, focus, disabled).

Abaixo estão a nova imagem com a escala completa e a tabela de códigos hexadecimais para referência direta.

Visualização da Escala Monocromática de Azul
, gerada com IA

Legenda das Variações na Imagem
Aqui estão os códigos hexadecimais correspondentes às novas variações mostradas na imagem:

Variações de Azul (Ação e Destaque - Coluna Direita)
Esta escala resolve o problema da falta de variação, oferecendo tons para todos os estados de UI:

Nome na Imagem	Código Hex	Uso Sugerido no Sistema
Blue-950	#172554	Fundo de Títulos profundos em Modo Dark.
Blue-900	#1E3A8A	Estado de Foco (Focus) em elementos escuros.
Blue-800	#1E40AF	Estado Ativo (Active) de botões/links no Modo Dark.
Blue-700	#1D4ED8	Estado de Hover de botões primários no Modo Dark.
Blue-600	#2563EB	Ação Principal (Primary) no Modo Light. (Original)
Blue-500	#3B82F6	Ação Principal no Modo Dark. (Original)
Blue-400	#60A5FA	Destaque em infográficos ou texto de apoio claro.
Blue-300	#93C5FD	Bordas de foco (Focus ring) ou estado Disabled ativo.
Blue-200	#BFDBFE	Fundo de componentes gráficos suaves.
Blue-100	#DBEAFE	Fundo de Alertas (Info) ou Tooltips claros.
Blue-50 	#EFF6FF	Fundo super suave, alternativo ao cinza N-50.

Cores Neutras Azuladas (Revisão - Coluna Esquerda)
Estes continuam sendo os cinzas com "DNA azul" para estrutura:

N-900 (Texto Principal): #0F172A
N-700 (Texto Secundário): #334155
N-500 (Ícones/Bordas): #64748B
N-300 (Dividers): #CBD5E1
N-100 (Hover Fundo): #F1F5F9
N-50 (Fundo Light Base): #F8FAFC