#!/usr/bin/env python3
"""Gera Proposta Safe Car em .docx"""

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

OUT = "/home/pftm/Downloads/Proposta_SafeCar_Pneus_PapiLAB.docx"


def set_cell_shading(cell, fill):
    shading = OxmlElement("w:shd")
    shading.set(qn("w:fill"), fill)
    cell._tc.get_or_add_tcPr().append(shading)


def add_heading(doc, text, level=1):
    p = doc.add_heading(text, level=level)
    for run in p.runs:
        run.font.color.rgb = RGBColor(0x13, 0x20, 0x38)
    return p


def add_bullets(doc, items):
    for item in items:
        doc.add_paragraph(item, style="List Bullet")


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    hdr = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = h
        set_cell_shading(hdr[i], "EEF3FB")
    for row in rows:
        cells = table.add_row().cells
        for i, val in enumerate(row):
            cells[i].text = val
    doc.add_paragraph("")


doc = Document()
section = doc.sections[0]
section.top_margin = Cm(2)
section.bottom_margin = Cm(2)
section.left_margin = Cm(2.2)
section.right_margin = Cm(2.2)

style = doc.styles["Normal"]
style.font.name = "Calibri"
style.font.size = Pt(11)

title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run("PROPOSTA COMERCIAL E ORÇAMENTO")
run.bold = True
run.font.size = Pt(16)
run.font.color.rgb = RGBColor(0x13, 0x20, 0x38)

sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
sub.add_run(
    "Desenvolvimento de site institucional / landing page de alta conversão\n"
    "Safe Car Pneus Remold — integração com Agendor CRM e WhatsApp"
).font.size = Pt(10.5)

doc.add_paragraph("")

parties = doc.add_table(rows=1, cols=2)
parties.style = "Table Grid"
c1, c2 = parties.rows[0].cells
c1.text = (
    "CONTRATADA / PRESTADORA\n"
    "Paulo Teodoro Pinto Júnior — PapiLAB\n"
    "CNPJ: 53.418.186/0001-60\n"
    "Rua Alferes José Caetano, 1745, apto 52A — Centro\n"
    "Piracicaba/SP — CEP 13400-123\n"
    "paulo@papijunior.com.br · (19) 99296-6346\n"
    "www.papijunior.com.br"
)
c2.text = (
    "CONTRATANTE / CLIENTE\n"
    "Safe Car Pneus Remold\n"
    "CNPJ: _______________________________\n"
    "Endereço: ____________________________\n"
    "Cidade/UF: ___________________________\n"
    "Representante: _______________________\n"
    "E-mail: ______________________________\n"
    "Telefone/WhatsApp: ___________________"
)
doc.add_paragraph("")

doc.add_paragraph(
    "Referência: Site atual em http://safecarpneus.com.br · Hospedagem: HostGator · "
    "Desenvolvimento anterior: Agência MKP."
)
doc.add_paragraph("Validade da proposta: 15 dias corridos a partir da data de envio.")

add_heading(doc, "CLÁUSULA 1ª — DO OBJETO", 2)
doc.add_paragraph(
    "1.1. Constitui objeto desta proposta a prestação de serviços técnicos especializados pela "
    "CONTRATADA para o desenvolvimento, implantação e publicação de um site institucional / landing "
    "page de alta conversão para a Safe Car Pneus Remold, com foco em apresentação de catálogo, "
    "diferenciais da marca, captação de revendedores (B2B) e integração com o CRM Agendor."
)
doc.add_paragraph(
    "1.2. O novo site substituirá a versão atual, mantendo identidade visual alinhada ao layout "
    "aprovado (paleta vermelha/preta, seções comerciais e formulário “Seja um Revendedor”)."
)

add_heading(doc, "CLÁUSULA 2ª — DO ESCOPO TÉCNICO", 2)
add_heading(doc, "2.1. Tipo de projeto", 3)
add_bullets(doc, [
    "Site institucional / landing page de alta conversão;",
    "Foco em captação de revendedores e apresentação de linhas de produto;",
    "Layout 100% responsivo (desktop, tablet e celular);",
    "Desenvolvimento em código limpo (HTML, CSS, JavaScript e PHP) ou CMS conforme ambiente do cliente.",
])

add_heading(doc, "2.2. Seções previstas no layout", 3)
add_table(doc, ["Seção", "Descrição"], [
    ["Header / Hero Banner", "Menu fixo, CTAs em destaque, banner principal com chamada comercial."],
    ["Categorias de Produtos", "Carros de passeio, motos, caminhão e linha pesada."],
    ["Pilares / Diferenciais", "Grid com ícones e estatísticas (10 anos, Inmetro, qualidade, custo-benefício, sustentabilidade)."],
    ["Sobre a Empresa", "Bloco institucional com imagem e indicadores."],
    ["Qualidade e Certificação", "Destaque para homologação INMETRO."],
    ["Vantagens para Revendedores", "Bloco B2B para atração de parceiros comerciais."],
    ["Formulário B2B", "Captação “Seja um Revendedor” com campos estratégicos."],
    ["Footer", "Contatos, endereço, links de navegação e redes."],
])

add_heading(doc, "2.3. Formulário “Seja um Revendedor”", 3)
add_bullets(doc, [
    "Nome completo; Empresa; CNPJ; Cidade/Estado; WhatsApp; E-mail;",
    "Segmento de atuação; Possui loja física (sim/não); Quantidade de pneus/mês; Mensagem.",
    "Validação básica, reCAPTCHA e mensagem de confirmação após envio.",
])

add_heading(doc, "2.4. Integração com Agendor CRM", 3)
add_bullets(doc, [
    "Mapeamento dos campos do formulário para o Agendor;",
    "Envio automático via Webhook e/ou API REST;",
    "Criação de lead/negócio no funil comercial;",
    "Tratamento de erros e testes em homologação.",
])

add_heading(doc, "2.5. Integração com WhatsApp", 3)
add_bullets(doc, [
    "Botões de contato rápido no header, rodapé e botão flutuante;",
    "Após envio ao Agendor, redirecionamento para WhatsApp com mensagem pré-preenchida;",
    "Links wa.me parametrizados para atendimento imediato.",
])

add_heading(doc, "2.6. Otimização, SEO e segurança", 3)
add_bullets(doc, [
    "Otimização de imagens; meta tags SEO e Open Graph;",
    "SSL (HTTPS); proteção antispam do formulário.",
])

add_heading(doc, "CLÁUSULA 3ª — DAS ETAPAS DE EXECUÇÃO", 2)
add_table(doc, ["Etapa", "Atividades", "Prazo"], [
    ["1. Kick-off", "Acessos (cPanel, Agendor, conteúdos) e subdomínio de homologação.", "1–2 dias úteis"],
    ["2. Layout e front-end", "Todas as seções, responsivo e botões WhatsApp.", "7–10 dias úteis"],
    ["3. Integrações", "Formulário B2B, API/Webhook Agendor e testes.", "3–5 dias úteis"],
    ["4. Homologação", "Validação, ajustes e publicação final.", "2–3 dias úteis"],
])
doc.add_paragraph("Prazo total estimado: 15 a 20 dias úteis, a partir do sinal, acessos e conteúdos finais.")

add_heading(doc, "CLÁUSULA 4ª — DO VALOR E FORMA DE PAGAMENTO", 2)
p = doc.add_paragraph()
p.add_run("Valor base do projeto (desenvolvimento + integrações): ").bold = True
p.add_run("R$ 2.000,00 (dois mil reais)\n")
p.add_run("Parcela de adaptações previstas no escopo: ").bold = True
p.add_run("R$ 1.000,00 (mil reais)\n")
p.add_run("Total previsto nesta proposta: ").bold = True
p.add_run("R$ 3.000,00 (três mil reais)")

doc.add_paragraph("Condição comercial em 3 etapas:", style="List Bullet")
add_bullets(doc, [
    "1ª parcela — R$ 1.000,00 (inicial): no aceite da proposta, liberando início do desenvolvimento e ambiente de testes;",
    "2ª parcela — R$ 1.000,00 (entrega): quando o site estiver pronto em homologação (layout + Agendor + WhatsApp);",
    "3ª parcela — R$ 1.000,00 (adaptações): ajustes previstos após validação do cliente e publicação final.",
])

doc.add_paragraph("Adaptações além do escopo:", style="List Bullet")
add_bullets(doc, [
    "A 3ª parcela cobre adaptações compatíveis com o escopo levantado nesta proposta;",
    "Se houver solicitações maiores que o previsto (novas seções, funcionalidades extras, integrações adicionais ou mudanças estruturais), o valor complementar será combinado previamente entre as partes;",
    "Nenhuma alteração de escopo relevante será executada sem aprovação prévia da CONTRATANTE.",
])

doc.add_paragraph("Forma de pagamento: PIX ou transferência bancária.")
add_bullets(doc, [
    "O desenvolvimento inicia somente após a 1ª parcela (R$ 1.000,00);",
    "A publicação no domínio oficial ocorre após homologação e quitação das parcelas de entrega e adaptações;",
    "Até a conclusão, o site permanece em ambiente de homologação.",
])

add_heading(doc, "CLÁUSULA 5ª — DO QUE ESTÁ INCLUSO", 2)
add_bullets(doc, [
    "Desenvolvimento completo das seções do escopo;",
    "Layout responsivo; integração Agendor e WhatsApp;",
    "SEO básico; antispam; publicação e homologação;",
    "Suporte corretivo por 15 dias após publicação (bugs, sem novas funcionalidades).",
])

add_heading(doc, "CLÁUSULA 6ª — DO QUE NÃO ESTÁ INCLUSO", 2)
add_bullets(doc, [
    "Hospedagem e domínio; plano Agendor com API/Webhook;",
    "APIs pagas de terceiros; textos/fotos/vídeos; tráfego pago;",
    "Manutenção evolutiva mensal após garantia (contratável à parte).",
])

add_heading(doc, "CLÁUSULA 7ª — RESPONSABILIDADES DA CONTRATANTE", 2)
add_bullets(doc, [
    "Acesso cPanel/HostGator; Token API Agendor;",
    "Textos, logos e imagens finais; WhatsApp comercial;",
    "Aprovações por escrito; acesso Registro.br se necessário.",
])

add_heading(doc, "CLÁUSULA 8ª — RESPONSABILIDADES DA CONTRATADA", 2)
add_bullets(doc, [
    "Desenvolver conforme escopo aprovado;",
    "Integrar Agendor + WhatsApp com testes;",
    "Backup do site anterior; homologação antes de publicar.",
])

add_heading(doc, "CLÁUSULA 9ª — LGPD", 2)
doc.add_paragraph(
    "As partes comprometem-se a cumprir a Lei nº 13.709/2018 (LGPD), protegendo os dados "
    "coletados pelo formulário para fins comerciais autorizados pela Safe Car."
)

add_heading(doc, "CLÁUSULA 10ª — DISPOSIÇÕES GERAIS", 2)
add_bullets(doc, [
    "Alterações de escopo geram aditivo com revisão de prazo e valor;",
    "Aceite pode ser formalizado em contrato de prestação de serviços;",
    "Foro: Comarca de Piracicaba/SP;",
    "Válida assinatura eletrônica e aceite por e-mail/WhatsApp com confirmação do sinal.",
])

doc.add_page_break()

add_heading(doc, "ANEXO A — MAPEAMENTO FORMULÁRIO → AGENDOR", 2)
add_table(doc, ["Campo no site", "Destino no Agendor"], [
    ["Nome", "Contato / pessoa"],
    ["Empresa", "Organização"],
    ["CNPJ", "Campo customizado"],
    ["Cidade/Estado", "Endereço / região"],
    ["WhatsApp", "Telefone principal"],
    ["E-mail", "E-mail do lead"],
    ["Segmento", "Campo customizado / tag"],
    ["Loja física", "Campo customizado"],
    ["Qtd. pneus/mês", "Campo customizado / potencial"],
    ["Mensagem", "Observações do negócio"],
])

add_heading(doc, "ANEXO B — FLUXO WHATSAPP PÓS-ENVIO", 2)
add_bullets(doc, [
    "Usuário preenche o formulário “Quero ser parceiro Safe Car”;",
    "Sistema valida e envia dados ao Agendor;",
    "Exibe confirmação e abre WhatsApp com mensagem pré-preenchida.",
])

add_heading(doc, "ANEXO C — RESUMO FINANCEIRO", 2)
add_table(doc, ["Parcela", "Valor", "Momento"], [
    ["1ª — Inicial", "R$ 1.000,00", "Aceite e início do projeto"],
    ["2ª — Entrega", "R$ 1.000,00", "Site pronto em homologação"],
    ["3ª — Adaptações", "R$ 1.000,00", "Ajustes previstos e publicação"],
    ["Total previsto", "R$ 3.000,00", ""],
])
doc.add_paragraph(
    "Observação: adaptações que ultrapassem o escopo levantado serão orçadas e combinadas "
    "previamente entre CONTRATADA e CONTRATANTE."
)

add_heading(doc, "ACEITE DA PROPOSTA", 2)
doc.add_paragraph(
    "Declaro estar de acordo com os termos, escopo, valor e condições de pagamento descritos nesta proposta."
)
doc.add_paragraph("")
doc.add_paragraph("__________________________________________\nPaulo Teodoro Pinto Júnior\nPapiLAB — CNPJ 53.418.186/0001-60\nCONTRATADA")
doc.add_paragraph("")
doc.add_paragraph("__________________________________________\nSafe Car Pneus Remold\nCONTRATANTE")
doc.add_paragraph("")
doc.add_paragraph("Local e data: Piracicaba/SP, _____ de _________________ de 2026.")

footer = doc.add_paragraph()
footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
footer.add_run(
    "\nPapiLAB — Engenharia de Software · Integração de Sistemas · Consultoria de TI\n"
    "paulo@papijunior.com.br · (19) 99296-6346 · www.papijunior.com.br"
).font.size = Pt(9)

doc.save(OUT)
print(f"Gerado: {OUT}")
