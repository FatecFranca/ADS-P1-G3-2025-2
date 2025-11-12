$(document).ready(function() {

    // --- Configurações ---
    const AUTO_ADVANCE_DELAY = 2500; // 2.5 segundos
    let autoAdvanceInterval;
    const $carousel = $('#carousel');
    const $items = $carousel.find('.item');
    const totalItems = $items.length;
    
    // As classes de nível que o seu CSS define, ordenadas do centro para fora (esquerda)
    const LEVEL_CLASSES = ['level0', 'level1', 'level2', 'level-2', 'level-1'];

    // --- Funções Principais ---

    /** * Calcula qual classe de nível aplicar a um item.
     * @param {number} itemIndex - O índice do item (0 a N-1).
     * @param {number} activeIndex - O índice do item central (ativo).
     */
    function calculateLevel(itemIndex, activeIndex) {
        // Distância do item ativo. Ex: item=0, active=2 -> level = 2
        let level = activeIndex - itemIndex; 
        
        // Lógica para carrossel circular (wraparound)
        if (level > 2) {
            level -= totalItems; // Ex: 4 - 5 = -1 (deve ser level -1)
        } else if (level < -2) {
            level += totalItems; // Ex: -3 + 5 = 2 (deve ser level 2)
        }
        
        return level; // Deve retornar -2, -1, 0, 1, 2
    }

    /** * Atualiza a posição visual de todos os itens.
     * @param {string} direction - 'left' ou 'right' (usado para as classes de transição)
     */
    function updateCarouselDisplay(direction) {
        let activeIndex = parseInt($carousel.data('active'));
        
        // Remove classes antigas de transição antes de aplicar as novas
        $items.removeClass('left-enter left-enter-active left-leave left-leave-active right-enter right-enter-active right-leave right-leave-active');
        
        // Remove todas as classes de nível antes de aplicar as novas
        LEVEL_CLASSES.forEach(cls => $items.removeClass(cls));

        $items.each(function() {
            const $item = $(this);
            const itemIndex = parseInt($item.data('index'));
            const level = calculateLevel(itemIndex, activeIndex);
            
            // Aplica a classe de nível correspondente (level0, level1, level-2, etc.)
            const levelClass = (level < 0 ? 'level' + level : 'level' + level);
            $item.addClass(levelClass);
        });

        // Adiciona as classes de transição para o item que está entrando/saindo se houver direção
        if (direction) {
            const leaveIndex = direction === 'right' 
                ? (activeIndex - 1 + totalItems) % totalItems  // Item que estava em level0
                : (activeIndex + 1) % totalItems;              // Item que estava em level0
                
            const enterIndex = direction === 'right' 
                ? (activeIndex + 2 + totalItems) % totalItems  // Item entrando pela direita (level-2)
                : (activeIndex - 2 + totalItems) % totalItems; // Item entrando pela esquerda (level2)
            
            // Note: A lógica de transição no CSS é complexa e exige uma implementação de biblioteca.
            // Para JQuery puro, você teria que usar .animate() ou gerenciar as classes manualmente,
            // mas o CSS sugere classes de enter/leave de React. 
            // Para simplificar e usar seu CSS, vamos apenas re-aplicar o estado final.
        }
    }

    /** Move o carrossel para a esquerda (índice ativo aumenta) */
    function moveRight() {
        let activeIndex = parseInt($carousel.data('active'));
        activeIndex = (activeIndex + 1) % totalItems;
        $carousel.data('active', activeIndex);
        updateCarouselDisplay('right');
    }

    /** Move o carrossel para a direita (índice ativo diminui) */
    function moveLeft() {
        let activeIndex = parseInt($carousel.data('active'));
        activeIndex = (activeIndex - 1 + totalItems) % totalItems; // + totalItems garante que o resultado é positivo
        $carousel.data('active', activeIndex);
        updateCarouselDisplay('left');
    }

    // --- Lógica de Auto-Advance ---

    function startAutoAdvance() {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = setInterval(moveRight, AUTO_ADVANCE_DELAY);
    }
    
    function stopAutoAdvance() {
        clearInterval(autoAdvanceInterval);
    }

    // --- Event Listeners ---
    
    // Inicia o carrossel na primeira renderização
    updateCarouselDisplay(null);
    startAutoAdvance();

    // Cliques nas setas
    $('.arrow-right').on('click', function() {
        stopAutoAdvance();
        moveRight();
        // Reinicia o avanço após um pequeno atraso, dando tempo para o usuário ver
        setTimeout(startAutoAdvance, 5000); 
    });

    $('.arrow-left').on('click', function() {
        stopAutoAdvance();
        moveLeft();
        // Reinicia o avanço após um pequeno atraso
        setTimeout(startAutoAdvance, 5000); 
    });

    // Pausa/Reinicia no mouse over (boa prática de UX)
    $carousel.on('mouseenter', stopAutoAdvance);
    $carousel.on('mouseleave', startAutoAdvance);

});