// SISAT-Saúde - Sistema de Informação de Satisfação dos Utentes
// Arquivo principal JavaScript

class SISATSaude {
    constructor() {
        this.data = null;
        this.charts = {};
        this.filters = {
            provincia: 'Todas',
            distrito: 'Todos',
            unidade: 'Todas',
            servico: 'Todos',
            periodo: 'Todos'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateCurrentDate();
        this.setupFileUpload();
        this.setupTabs();
    }
    
    setupEventListeners() {
        // File upload
        document.getElementById('uploadArea').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });
        
        // Drag and drop
        const uploadArea = document.getElementById('uploadArea');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#667eea';
            uploadArea.style.background = 'rgba(102, 126, 234, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            uploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            uploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
            
            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });
        
        // Link button
        document.getElementById('loadLinkBtn').addEventListener('click', () => {
            const link = document.getElementById('webLink').value;
            if (link) {
                this.loadFromLink(link);
            }
        });
        
        // Apply filters button
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.updateFilters();
            this.refreshDashboard();
        });
        
        // Filter change events
        document.getElementById('provinciaFilter').addEventListener('change', (e) => {
            this.filters.provincia = e.target.value;
        });
        
        document.getElementById('distritoFilter').addEventListener('change', (e) => {
            this.filters.distrito = e.target.value;
        });
        
        document.getElementById('unidadeFilter').addEventListener('change', (e) => {
            this.filters.unidade = e.target.value;
        });
        
        document.getElementById('servicoFilter').addEventListener('change', (e) => {
            this.filters.servico = e.target.value;
        });
        
        document.getElementById('periodoFilter').addEventListener('change', (e) => {
            this.filters.periodo = e.target.value;
        });
    }
    
    setupTabs() {
        const tabs = document.querySelectorAll('.source-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const tabId = tab.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                if (tabId === 'upload') {
                    document.getElementById('uploadTab').classList.add('active');
                } else {
                    document.getElementById('linkTab').classList.add('active');
                }
            });
        });
    }
    
    updateCurrentDate() {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = date.toLocaleDateString('pt-PT', options);
    }
    
    setupFileUpload() {
        // Prevenir comportamento padrão do drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.body.addEventListener(eventName, (e) => e.preventDefault());
            document.body.addEventListener(eventName, (e) => e.stopPropagation());
        });
    }
    
    handleFileUpload(file) {
        if (!file) return;
        
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];
        
        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
            this.showNotification('Formato de arquivo não suportado. Use .xlsx, .xls ou .csv', 'error');
            return;
        }
        
        this.showLoading();
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                // Simular processamento de dados
                setTimeout(() => {
                    this.processDadosSimulados();
                    this.hideLoading();
                    this.showNotification('Dados carregados com sucesso!', 'success');
                }, 2000);
            } catch (error) {
                this.hideLoading();
                this.showNotification('Erro ao processar arquivo', 'error');
                console.error(error);
            }
        };
        
        reader.onerror = () => {
            this.hideLoading();
            this.showNotification('Erro ao ler arquivo', 'error');
        };
        
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }
    
    loadFromLink(link) {
        this.showLoading();
        
        // Simular carregamento de link
        setTimeout(() => {
            this.processDadosSimulados();
            this.hideLoading();
            this.showNotification('Dados carregados do link com sucesso!', 'success');
        }, 2000);
    }
    
    processDadosSimulados() {
        // Dados simulados para demonstração
        this.data = {
            global: 78.5,
            tempoEspera: 65.2,
            humanizacao: 82.3,
            higiene: 88.7,
            seguranca: 79.1,
            acesso: 71.4,
            porServico: {
                'Consulta': 76.2,
                'Farmácia': 82.5,
                'Internamento': 71.8,
                'Laboratório': 84.3,
                'Radiologia': 79.6
            },
            dimensoes: {
                'Tempo de Espera': 65.2,
                'Atendimento': 78.9,
                'Humanização': 82.3,
                'Higiene': 88.7,
                'Segurança': 79.1,
                'Acesso': 71.4
            },
            tendencia: [72.5, 74.8, 76.2, 75.9, 77.4, 78.5]
        };
        
        // Atualizar filtros com dados simulados
        this.updateFiltersFromData();
        
        // Mostrar dashboard e esconder welcome
        document.getElementById('welcomeSection').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
        document.getElementById('filtersPanel').style.display = 'block';
        
        // Atualizar dashboard
        this.updateKPIs();
        this.createCharts();
        this.updateAlerts();
    }
    
    updateFiltersFromData() {
        // Simular opções de filtro
        const provincias = ['Todas', 'Maputo', 'Gaza', 'Inhambane', 'Sofala', 'Manica', 'Tete', 'Zambézia', 'Nampula', 'Cabo Delgado', 'Niassa'];
        const distritos = ['Todos', 'Cidade', 'Marracuene', 'Boane', 'Matola', 'Manhiça'];
        const unidades = ['Todas', 'Hospital Central', 'Hospital Provincial', 'Hospital Distrital', 'Centro de Saúde'];
        const periodos = ['Todos', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
        
        this.populateSelect('provinciaFilter', provincias);
        this.populateSelect('distritoFilter', distritos);
        this.populateSelect('unidadeFilter', unidades);
        this.populateSelect('periodoFilter', periodos);
    }
    
    populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        select.innerHTML = '';
        
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
    }
    
    updateFilters() {
        // Atualizar objeto de filtros com valores atuais
        this.filters = {
            provincia: document.getElementById('provinciaFilter').value,
            distrito: document.getElementById('distritoFilter').value,
            unidade: document.getElementById('unidadeFilter').value,
            servico: document.getElementById('servicoFilter').value,
            periodo: document.getElementById('periodoFilter').value
        };
    }
    
    refreshDashboard() {
        this.showLoading();
        
        // Simular atualização com filtros
        setTimeout(() => {
            // Ajustar dados baseado nos filtros (simulado)
            if (this.filters.servico !== 'Todos') {
                // Mostrar apenas dados do serviço selecionado
                this.updateKPIsWithFilter();
            } else {
                this.updateKPIs();
            }
            
            this.updateCharts();
            this.updateAlerts();
            this.hideLoading();
            
            this.showNotification('Dashboard atualizado com os filtros aplicados!', 'success');
        }, 1000);
    }
    
    updateKPIs() {
        if (!this.data) return;
        
        // Animar valores
        this.animateValue('globalSatisfaction', 0, this.data.global, 1000, '%');
        this.animateValue('tempoEsperaValue', 0, this.data.tempoEspera, 1000, '%');
        this.animateValue('humanizacaoValue', 0, this.data.humanizacao, 1000, '%');
        this.animateValue('higieneValue', 0, this.data.higiene, 1000, '%');
        
        // Atualizar barras de progresso
        this.updateProgressBar('globalProgress', this.data.global, 80);
        this.updateProgressBar('tempoEsperaProgress', this.data.tempoEspera, 70);
        this.updateProgressBar('humanizacaoProgress', this.data.humanizacao, 85);
        this.updateProgressBar('higieneProgress', this.data.higiene, 90);
    }
    
    updateKPIsWithFilter() {
        // Simular dados filtrados
        const valoresFiltrados = {
            global: this.data.global * (0.9 + Math.random() * 0.2),
            tempoEspera: this.data.tempoEspera * (0.9 + Math.random() * 0.2),
            humanizacao: this.data.humanizacao * (0.9 + Math.random() * 0.2),
            higiene: this.data.higiene * (0.9 + Math.random() * 0.2)
        };
        
        this.animateValue('globalSatisfaction', parseFloat(document.getElementById('globalSatisfaction').textContent), valoresFiltrados.global, 800, '%');
        this.animateValue('tempoEsperaValue', parseFloat(document.getElementById('tempoEsperaValue').textContent), valoresFiltrados.tempoEspera, 800, '%');
        this.animateValue('humanizacaoValue', parseFloat(document.getElementById('humanizacaoValue').textContent), valoresFiltrados.humanizacao, 800, '%');
        this.animateValue('higieneValue', parseFloat(document.getElementById('higieneValue').textContent), valoresFiltrados.higiene, 800, '%');
        
        this.updateProgressBar('globalProgress', valoresFiltrados.global, 80);
        this.updateProgressBar('tempoEsperaProgress', valoresFiltrados.tempoEspera, 70);
        this.updateProgressBar('humanizacaoProgress', valoresFiltrados.humanizacao, 85);
        this.updateProgressBar('higieneProgress', valoresFiltrados.higiene, 90);
    }
    
    animateValue(elementId, start, end, duration, suffix = '') {
        const element = document.getElementById(elementId);
        const range = end - start;
        const increment = range / (duration / 10);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = current.toFixed(1) + suffix;
        }, 10);
    }
    
    updateProgressBar(elementId, value, meta) {
        const progressBar = document.getElementById(elementId);
        const percentage = (value / meta) * 100;
        progressBar.style.width = Math.min(percentage, 100) + '%';
        
        // Mudar cor baseado no desempenho
        if (value < meta * 0.8) {
            progressBar.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
        } else if (value < meta) {
            progressBar.style.background = 'linear-gradient(135deg, #ffd88b, #ffb347)';
        } else {
            progressBar.style.background = 'linear-gradient(135deg, #a8e063, #56ab2f)';
        }
    }
    
    createCharts() {
        this.createServicoChart();
        this.createRadarChart();
        this.createTendenciaChart();
    }
    
    updateCharts() {
        // Atualizar dados dos charts baseado nos filtros
        if (this.charts.servico) {
            this.charts.servico.data.datasets[0].data = Object.values(this.data.porServico);
            this.charts.servico.update();
        }
        
        if (this.charts.radar) {
            this.charts.radar.data.datasets[0].data = Object.values(this.data.dimensoes);
            this.charts.radar.update();
        }
        
        if (this.charts.tendencia) {
            // Simular tendência com variação baseada nos filtros
            const variacao = this.filters.servico !== 'Todos' ? 0.9 + Math.random() * 0.2 : 1;
            const novaTendencia = this.data.tendencia.map(v => v * variacao);
            this.charts.tendencia.data.datasets[0].data = novaTendencia;
            this.charts.tendencia.update();
        }
    }
    
    createServicoChart() {
        const ctx = document.getElementById('servicoChart').getContext('2d');
        
        this.charts.servico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(this.data.porServico),
                datasets: [{
                    label: 'Satisfação (%)',
                    data: Object.values(this.data.porServico),
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(94, 166, 240, 0.8)',
                        'rgba(168, 224, 99, 0.8)',
                        'rgba(255, 107, 107, 0.8)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(240, 147, 251, 1)',
                        'rgba(94, 166, 240, 1)',
                        'rgba(168, 224, 99, 1)',
                        'rgba(255, 107, 107, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
    
    createRadarChart() {
        const ctx = document.getElementById('radarChart').getContext('2d');
        
        this.charts.radar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: Object.keys(this.data.dimensoes),
                datasets: [{
                    label: 'Satisfação',
                    data: Object.values(this.data.dimensoes),
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 216, 139, 1)',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                size: 11
                            }
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            backdropColor: 'transparent'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
    
    createTendenciaChart() {
        const ctx = document.getElementById('tendenciaChart').getContext('2d');
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        
        this.charts.tendencia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Satisfação Global',
                    data: this.data.tendencia,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(255, 216, 139, 1)',
                    pointBorderColor: '#fff',
                    pointRadius: 6,
                    pointHoverRadius: 10,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
    
    updateAlerts() {
        const alertsContainer = document.getElementById('alertsContainer');
        alertsContainer.innerHTML = '';
        
        const alerts = this.generateAlerts();
        
        alerts.forEach(alert => {
            const alertCard = document.createElement('div');
            alertCard.className = `alert-card ${alert.type}`;
            alertCard.innerHTML = `
                <div class="alert-header">
                    <i class="${alert.icon}"></i>
                    <h4>${alert.title}</h4>
                </div>
                <p class="alert-message">${alert.message}</p>
                <div class="alert-action">
                    <i class="fas fa-lightbulb"></i>
                    <span>${alert.action}</span>
                </div>
            `;
            
            alertsContainer.appendChild(alertCard);
        });
    }
    
    generateAlerts() {
        const alerts = [];
        
        // Verificar tempo de espera
        if (this.data.tempoEspera < 70) {
            alerts.push({
                type: 'critical',
                icon: 'fas fa-exclamation-circle',
                title: 'Tempo de Espera Crítico',
                message: `Tempo de espera está em ${this.data.tempoEspera}%, abaixo da meta de 70%.`,
                action: 'Rever fluxos de atendimento e distribuição de recursos humanos'
            });
        }
        
        // Verificar humanização
        if (this.data.humanizacao < 85) {
            alerts.push({
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                title: 'Atenção: Humanização',
                message: `Humanização em ${this.data.humanizacao}%. Necessário reforçar capacitação.`,
                action: 'Promover treinamentos em atendimento humanizado'
            });
        }
        
        // Verificar serviços específicos
        for (const [servico, valor] of Object.entries(this.data.porServico)) {
            if (valor < 75) {
                alerts.push({
                    type: 'critical',
                    icon: 'fas fa-hospital',
                    title: `${servico} - Atenção`,
                    message: `Satisfação em ${valor}% neste serviço.`,
                    action: 'Realizar análise detalhada e supervisão específica'
                });
                break;
            }
        }
        
        // Verificar satisfação global
        if (this.data.global < 80) {
            alerts.push({
                type: 'warning',
                icon: 'fas fa-chart-line',
                title: 'Satisfação Global Abaixo da Meta',
                message: `Satisfação global em ${this.data.global}% (meta: 80%).`,
                action: 'Elaborar plano de melhoria integrado'
            });
        }
        
        // Se tudo estiver bem, mostrar mensagem positiva
        if (alerts.length === 0) {
            alerts.push({
                type: 'success',
                icon: 'fas fa-check-circle',
                title: 'Tudo dentro das metas!',
                message: 'Todos os indicadores estão dentro das metas estabelecidas.',
                action: 'Mantenha as boas práticas e continue monitorando'
            });
        }
        
        return alerts;
    }
    
    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
    
    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
    
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Adicionar estilos
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.background = type === 'success' ? 'linear-gradient(135deg, #a8e063, #56ab2f)' : 
                                      type === 'error' ? 'linear-gradient(135deg, #ff6b6b, #ff8e8e)' : 
                                      'linear-gradient(135deg, #667eea, #764ba2)';
        notification.style.color = 'white';
        notification.style.borderRadius = '50px';
        notification.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '1001';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '10px';
        notification.style.animation = 'slideInRight 0.3s ease';
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.sisat = new SISATSaude();
});
