// Armazenamento local para links clicados
let clickedLinks = new Set();

// Carregar links clicados do localStorage
function loadClickedLinks() {
    const saved = localStorage.getItem('instagramClickedLinks');
    if (saved) {
        clickedLinks = new Set(JSON.parse(saved));
    }
}

// Salvar links clicados no localStorage
function saveClickedLinks() {
    localStorage.setItem('instagramClickedLinks', JSON.stringify([...clickedLinks]));
}

// Marcar um link como visitado
function markAsClicked(link) {
    clickedLinks.add(link);
    saveClickedLinks();
    updateLinkDisplay();
}

// Desmarcar um link como visitado
function markAsUnclicked(link) {
    clickedLinks.delete(link);
    saveClickedLinks();
    updateLinkDisplay();
}

// Abrir link em nova aba
function openInNewTab(url) {
    window.open(url, '_blank');
}

// Atualizar a exibição dos links
function updateLinkDisplay() {
    const links = document.querySelectorAll('#result a');
    
    links.forEach(link => {
        const linkHref = link.getAttribute('data-href') || link.href;
        const listItem = link.closest('li');
        const indicator = listItem.querySelector('.click-indicator');
        
        if (clickedLinks.has(linkHref)) {
            link.classList.add('visited');
            indicator.classList.add('visited');
        } else {
            link.classList.remove('visited');
            indicator.classList.remove('visited');
        }
    });
    
    // Atualizar estatísticas
    updateStats();
}

// Atualizar estatísticas
function updateStats() {
    const totalLinks = document.querySelectorAll('#result a').length;
    const visitedCount = document.querySelectorAll('#result a.visited').length;
    const unvisitedCount = totalLinks - visitedCount;
    
    let statsDiv = document.querySelector('.stats');
    let instructionsDiv = document.querySelector('.instructions');
    
    if (!statsDiv && totalLinks > 0) {
        statsDiv = document.createElement('div');
        statsDiv.className = 'stats';
        const resultDiv = document.getElementById('result');
        resultDiv.insertBefore(statsDiv, resultDiv.firstChild);
    }
    
    if (!instructionsDiv && totalLinks > 0) {
        instructionsDiv = document.createElement('div');
        instructionsDiv.className = 'instructions';
        instructionsDiv.innerHTML = `
            <strong><i class="fas fa-info-circle"></i> Instruções de Uso:</strong><br>
            <div style="margin-top: 8px;">
            • <strong>Clique no @</strong> → Abre perfil em nova aba e marca como visitado<br>
            • <strong>Clique do Meio (Roda)</strong> → Abre em nova aba e marca<br>
            • <strong>CTRL + Clique</strong> → Abre em nova aba e marca<br>
            • <strong>Botão "Abrir"</strong> → Abre na mesma aba e marca<br>
            • <strong>Botão "Nova Aba"</strong> → Abre em nova aba e marca
            </div>
        `;
        const resultDiv = document.getElementById('result');
        const existingStats = resultDiv.querySelector('.stats');
        if (existingStats) {
            resultDiv.insertBefore(instructionsDiv, existingStats.nextSibling);
        } else {
            resultDiv.insertBefore(instructionsDiv, resultDiv.firstChild);
        }
    }
    
    if (statsDiv && totalLinks > 0) {
        statsDiv.innerHTML = `
            <strong><i class="fas fa-chart-bar"></i> Estatísticas de Progresso:</strong>
            <div style="display: flex; gap: 16px; margin-top: 8px;">
                <span style="color:#40C057"><i class="fas fa-check-circle"></i> ${visitedCount} visitados</span>
                <span style="color:#E1306C"><i class="fas fa-times-circle"></i> ${unvisitedCount} não visitados</span>
                <span style="color:#0095f6"><i class="fas fa-hashtag"></i> ${totalLinks} total</span>
            </div>
        `;
    }
}

// Criar botões de ação para cada link
function createActionButtons(url) {
    const container = document.createElement('div');
    container.className = 'open-actions';
    
    // Botão para abrir na mesma aba
    const openSameBtn = document.createElement('button');
    openSameBtn.className = 'open-btn';
    openSameBtn.innerHTML = '<i class="fas fa-external-link-alt"></i>';
    openSameBtn.title = 'Abrir na mesma aba';
    openSameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        markAsClicked(url);
        window.open(url, '_self');
    });
    
    // Botão para abrir em nova aba
    const openNewBtn = document.createElement('button');
    openNewBtn.className = 'open-btn new-tab';
    openNewBtn.innerHTML = '<i class="fas fa-external-link-square-alt"></i>';
    openNewBtn.title = 'Abrir em nova aba';
    openNewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        markAsClicked(url);
        openInNewTab(url);
    });
    
    container.appendChild(openSameBtn);
    container.appendChild(openNewBtn);
    
    return container;
}

// Processar os dados
document.getElementById("processar").addEventListener("click", () => {
    const meusSeguidoresText = document.getElementById("meusSeguidores").value.trim();
    const meusSeguindoText = document.getElementById("meusSeguindo").value.trim();
    const seguidoresAlvoText = document.getElementById("seguidoresAlvo").value.trim();
    const resultDiv = document.getElementById("result");
    const output = document.getElementById("output");
    const processBtn = document.getElementById("processar");

    if (!meusSeguidoresText || !seguidoresAlvoText) {
        alert("Por favor, cole sua lista de seguidores e a do alvo antes de continuar!");
        return;
    }

    // Adicionar efeito de processamento
    processBtn.classList.add('processing');
    output.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando listas... <span class="loading-dots"><span></span><span></span><span></span></span>';

    // Simular processamento assíncrono para melhor UX
    setTimeout(() => {
        processListas();
        processBtn.classList.remove('processing');
    }, 300);
});

function processListas() {
    const meusSeguidoresText = document.getElementById("meusSeguidores").value.trim();
    const meusSeguindoText = document.getElementById("meusSeguindo").value.trim();
    const seguidoresAlvoText = document.getElementById("seguidoresAlvo").value.trim();
    const resultDiv = document.getElementById("result");
    const output = document.getElementById("output");

    // Lista de palavras proibidas (ignoradas automaticamente)
    const ignorar = [
        "sobre","ajuda","imprensa","api","carreiras","privacidade","termos",
        "localizações","idioma","português (brasil)","meta verified",
        "© 2025 instagram from meta","página inicial","explorar","reels","9+",
        "mensagens","notificações","foto do perfil de","perfil",
        "meta ai","threads","mais","criar","pesquisar","login","criar uma conta",
        "baixe o aplicativo","diretório","hashtags","local","entrar na minha conta"
    ];

    const regexID = /^[a-zA-Z0-9._@]+$/;
    const limpar = texto => texto.split(/\r?\n/)
        .map(l => l.trim().toLowerCase().replace(/^@/, ''))
        .filter(l =>
            l &&
            regexID.test(l) &&
            !ignorar.some(termo => l.includes(termo))
        );

    const meusSeguidores = new Set(limpar(meusSeguidoresText));
    const meusSeguindo = meusSeguindoText ? new Set(limpar(meusSeguindoText)) : null;
    const seguidoresAlvo = limpar(seguidoresAlvoText);

    // Filtra quem segue o alvo, mas não te segue
    let resultado = seguidoresAlvo.filter(id => !meusSeguidores.has(id));

    // Se o usuário informou quem ele segue, filtra também quem ele já segue
    if (meusSeguindo) {
        resultado = resultado.filter(id => !meusSeguindo.has(id));
    }

    // ============ NOVO CÓDIGO: CÁLCULO DAS ESTATÍSTICAS ============
    const totalSeguidoresAlvo = seguidoresAlvo.length;
    const totalMeusSeguidores = meusSeguidores.size;
    const totalMeusSeguindo = meusSeguindo ? meusSeguindo.size : 0;

    // Calcula interseções
    const seguemAlvoEMim = seguidoresAlvo.filter(id => meusSeguidores.has(id)).length;
    const naoSeguemDeVolta = totalSeguidoresAlvo - seguemAlvoEMim;
    
    // Calcula porcentagens
    const porcentagemSeguemAmbos = totalSeguidoresAlvo > 0 
        ? ((seguemAlvoEMim / totalSeguidoresAlvo) * 100).toFixed(1)
        : '0.0';
    const porcentagemNovos = totalSeguidoresAlvo > 0
        ? ((resultado.length / totalSeguidoresAlvo) * 100).toFixed(1)
        : '0.0';

    // Cria HTML das estatísticas
    let estatisticasHTML = `
        <div class="stats-summary">
            <div class="stats-header">
                <h3><i class="fas fa-chart-pie"></i> RESUMO ESTATÍSTICO COMPLETO</h3>
                <span style="font-size: 12px; color: #8e8e8e; background: #fafafa; padding: 4px 8px; border-radius: 4px;">
                    <i class="fas fa-sync-alt"></i> Processado em tempo real
                </span>
            </div>
            <div class="stats-grid">
                <div class="stat-item" style="border-left: 4px solid #405DE6;">
                    <div class="stat-label">Seguidores do Alvo</div>
                    <div class="stat-value" style="color: #405DE6;">${totalSeguidoresAlvo.toLocaleString()}</div>
                </div>
                <div class="stat-item" style="border-left: 4px solid #E1306C;">
                    <div class="stat-label">Meus Seguidores</div>
                    <div class="stat-value" style="color: #E1306C;">${totalMeusSeguidores.toLocaleString()}</div>
                </div>
                ${meusSeguindo ? `
                <div class="stat-item" style="border-left: 4px solid #F56040;">
                    <div class="stat-label">Pessoas que Eu Sigo</div>
                    <div class="stat-value" style="color: #F56040;">${totalMeusSeguindo.toLocaleString()}</div>
                </div>
                ` : ''}
                <div class="stat-item" style="border-left: 4px solid #40C057;">
                    <div class="stat-label">Seguem o Alvo E a Mim</div>
                    <div class="stat-value" style="color: #40C057;">${seguemAlvoEMim.toLocaleString()}</div>
                    <div style="font-size: 11px; color: #8e8e8e; margin-top: 5px;">
                        ${porcentagemSeguemAmbos}% dos seguidores do alvo
                    </div>
                </div>
                <div class="stat-item" style="border-left: 4px solid #FD1D1D;">
                    <div class="stat-label">Não me Seguem de Volta</div>
                    <div class="stat-value" style="color: #FD1D1D;">${naoSeguemDeVolta.toLocaleString()}</div>
                </div>
                <div class="stat-item" style="border-left: 4px solid #0095f6;">
                    <div class="stat-label">Perfis Novos Encontrados</div>
                    <div class="stat-value" style="color: #0095f6;">${resultado.length.toLocaleString()}</div>
                    <div style="font-size: 11px; color: #8e8e8e; margin-top: 5px;">
                        ${porcentagemNovos}% dos seguidores do alvo
                    </div>
                </div>
            </div>
        </div>
    `;

    if (resultado.length === 0) {
        output.innerHTML = estatisticasHTML + 
            '<div style="padding: 20px; background: #fff3cd; border-radius: 8px; border: 1px solid #ffeaa7; color: #856404;">' +
            '<i class="fas fa-exclamation-circle"></i> <strong>Nenhum perfil novo encontrado</strong> — todos já te seguem ou você já os segue.</div>';
        resultDiv.style.display = "none";
        resultDiv.innerHTML = "";
    } else {
        const mensagem = meusSeguindo
            ? `<div style="padding: 15px; background: #d4edda; border-radius: 8px; border: 1px solid #c3e6cb; color: #155724; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i> <strong>${resultado.length.toLocaleString()} perfis</strong> seguem o alvo, não te seguem e você ainda não segue.
               </div>`
            : `<div style="padding: 15px; background: #d4edda; border-radius: 8px; border: 1px solid #c3e6cb; color: #155724; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i> <strong>${resultado.length.toLocaleString()} perfis</strong> seguem o alvo mas ainda não te seguem.
               </div>`;
        
        output.innerHTML = estatisticasHTML + mensagem;
        resultDiv.style.display = "block";

        const lista = document.createElement("ol");
        resultado.forEach((user, index) => {
            const li = document.createElement("li");
            const url = `https://www.instagram.com/${user}/`;
            
            // Container para link e indicador
            const linkContainer = document.createElement('div');
            linkContainer.className = 'link-container';
            
            // Indicador visual de clique
            const indicator = document.createElement("span");
            indicator.className = "click-indicator";
            linkContainer.appendChild(indicator);
            
            // *** CORREÇÃO PRINCIPAL: Link do Instagram que realmente navega ***
            const a = document.createElement("a");
            a.href = url; // AGORA VAI PARA O LINK REAL DO INSTAGRAM
            a.target = "_blank"; // Abre em nova aba por padrão
            a.rel = "noopener noreferrer"; // Boas práticas de segurança
            a.setAttribute('data-href', url); // Guarda a URL real para referência
            a.textContent = `${user}`;
            a.title = `Abrir perfil de @${user} no Instagram\n\nClique: abre em nova aba e marca como visitado\nClique do meio: marca como visitado\nCTRL+clique: marca como visitado`;
            
            // Evento para marcar como clicado quando o link é aberto
            a.addEventListener('click', function(e) {
                // Marca como clicado quando o link é aberto
                markAsClicked(url);
                
                // Se for CTRL+clique ou clique do meio, permite comportamento padrão
                if (e.ctrlKey || e.metaKey || e.button === 1) {
                    return; // Permite abrir em nova aba (comportamento padrão do target="_blank")
                }
                
                // Para clique normal (botão esquerdo), o target="_blank" já cuida de abrir nova aba
                // O markAsClicked já foi chamado acima
            });
            
            // Evento auxiliar para clique do meio (mouseup)
            a.addEventListener('mouseup', function(e) {
                // Clique do meio (botão da roda)
                if (e.button === 1) {
                    markAsClicked(url);
                    // O target="_blank" já cuida de abrir em nova aba
                }
            });
            
            // Evento auxclick para clique do meio
            a.addEventListener('auxclick', function(e) {
                if (e.button === 1) { // Clique do meio
                    markAsClicked(url);
                }
            });
            
            // Também marca com Enter
            a.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    markAsClicked(url);
                    // Abre o link quando Enter é pressionado
                    window.open(url, '_blank');
                }
            });
            
            linkContainer.appendChild(a);
            li.appendChild(linkContainer);
            
            // Botões de ação (abrir/nova aba)
            const actionButtons = createActionButtons(url);
            li.appendChild(actionButtons);
            
            lista.appendChild(li);
        });

        resultDiv.innerHTML = "";
        resultDiv.appendChild(lista);
        
        // Carregar links já clicados e atualizar display
        loadClickedLinks();
        updateLinkDisplay();
    }
}

// Botão copiar
document.getElementById("copyBtn").addEventListener("click", () => {
    const resultLinks = document.querySelectorAll("#result a[data-href]");
    if (resultLinks.length === 0) return alert("Nada para copiar!");
    const textToCopy = Array.from(resultLinks).map(a => a.getAttribute('data-href')).join("\n");
    navigator.clipboard.writeText(textToCopy);
    
    // Feedback visual
    const copyBtn = document.getElementById("copyBtn");
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    copyBtn.style.background = 'linear-gradient(45deg, #40C057, #2F9E44)';
    setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.background = 'linear-gradient(45deg, #E1306C, #C13584)';
    }, 2000);
});

// Botão limpar tudo
document.getElementById("clearBtn").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja limpar todas as listas?")) {
        document.getElementById("meusSeguidores").value = "";
        document.getElementById("meusSeguindo").value = "";
        document.getElementById("seguidoresAlvo").value = "";
        document.getElementById("result").style.display = "none";
        document.getElementById("output").innerHTML = '<i class="fas fa-clock"></i> Aguardando processamento...';
        
        // Remover div de estatísticas e instruções, se existirem
        const statsDiv = document.querySelector('.stats');
        const instructionsDiv = document.querySelector('.instructions');
        if (statsDiv) statsDiv.remove();
        if (instructionsDiv) instructionsDiv.remove();
    }
});

// Botão limpar histórico
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja limpar o histórico de links clicados?\nIsso não afeta as listas de seguidores.")) {
        clickedLinks.clear();
        localStorage.removeItem('instagramClickedLinks');
        updateLinkDisplay();
        
        // Feedback visual
        const clearHistoryBtn = document.getElementById("clearHistoryBtn");
        const originalHTML = clearHistoryBtn.innerHTML;
        clearHistoryBtn.innerHTML = '<i class="fas fa-check"></i> Histórico Limpo!';
        clearHistoryBtn.style.background = 'linear-gradient(45deg, #40C057, #2F9E44)';
        setTimeout(() => {
            clearHistoryBtn.innerHTML = originalHTML;
            clearHistoryBtn.style.background = 'linear-gradient(45deg, #8e8e8e, #a8a8a8)';
        }, 2000);
    }
});

// Inicializar
loadClickedLinks();
