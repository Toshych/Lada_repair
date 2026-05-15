document.addEventListener('DOMContentLoaded', function() {
    // Get all breakdown links
    const breakdownLinks = document.querySelectorAll('.breakdown-link');
    const backButtons = document.querySelectorAll('.back-button');

    // Add click event listeners to breakdown links
    breakdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the target repair instruction ID
            const targetId = this.getAttribute('data-target');

            // Hide all categories and show the target repair instruction
            document.querySelectorAll('.category-section').forEach(section => {
                section.style.display = 'none';
            });

            document.querySelectorAll('.repair-instruction').forEach(instruction => {
                instruction.classList.remove('active');
            });

            // Show the selected repair instruction
            const targetInstruction = document.getElementById(targetId);
            if (targetInstruction) {
                targetInstruction.classList.add('active');

                // Update breadcrumb
                const breadcrumb = document.querySelector('.breadcrumb');
                const categoryTitle = this.closest('.category-section').querySelector('.category-title').textContent;
                const breakdownTitle = this.textContent;

                breadcrumb.innerHTML = `
                    <a href="#" class="breadcrumb-back">Категории</a> >
                    <span>${categoryTitle}</span> >
                    <span>${breakdownTitle}</span>
                `;

                // Add event listener to breadcrumb back link
                document.querySelector('.breadcrumb-back').addEventListener('click', function(e) {
                    e.preventDefault();
                    showAllCategories();
                });
            }
        });
    });

    // Add click event listeners to back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            showAllCategories();
        });
    });

    function showAllCategories() {
        // Show all categories and hide all repair instructions
        document.querySelectorAll('.category-section').forEach(section => {
            section.style.display = 'block';
        });

        document.querySelectorAll('.repair-instruction').forEach(instruction => {
            instruction.classList.remove('active');
        });

        // Reset breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb');
        breadcrumb.innerHTML = 'Выберите категорию и поломку для просмотра инструкции';
    }

    // Initialize - show all categories
    showAllCategories();
});