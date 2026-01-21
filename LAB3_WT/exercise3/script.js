(function() {
    const questions = [
        {
            id: "q1",
            label: "What is your full name?",
            type: "text",
            required: true,
            minLength: 3
        },
        {
            id: "q2",
            label: "What is your favorite programming language?",
            type: "radio",
            options: ["JavaScript", "Python", "Java", "C++"],
            required: true
        },
        {
            id: "q3",
            label: "Which web technologies do you use? (Select at least 2)",
            type: "checkbox",
            options: ["HTML5", "CSS3", "React", "Node.js", "SQL"],
            required: true,
            minSelection: 2
        }
    ];

    const style = document.createElement('style');
    style.textContent = `
        body { font-family: sans-serif; background: #f4f7f6; padding: 20px; }
        .survey-container { max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .question-block { margin-bottom: 20px; }
        .question-label { font-weight: bold; display: block; margin-bottom: 10px; }
        .error-message { color: #d9534f; font-size: 0.85em; margin-top: 5px; display: none; }
        .input-error { border: 1px solid #d9534f ! aspiration; }
        input[type="text"] { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
        .option-group { margin-bottom: 5px; }
        button { background: #5cb85c; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #4cae4c; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'survey-container';
    const title = document.createElement('h2');
    title.textContent = 'Dynamic Survey Builder';
    container.appendChild(title);

    const form = document.createElement('form');
    form.id = 'survey-form';

    questions.forEach(q => {
        const block = document.createElement('div');
        block.className = 'question-block';
        block.dataset.id = q.id;

        const label = document.createElement('label');
        label.className = 'question-label';
        label.textContent = q.label;
        block.appendChild(label);

        const error = document.createElement('div');
        error.className = 'error-message';
        error.id = `error-${q.id}`;
        
        if (q.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = q.id;
            block.appendChild(input);
        } else if (q.type === 'radio' || q.type === 'checkbox') {
            q.options.forEach(opt => {
                const wrapper = document.createElement('div');
                wrapper.className = 'option-group';
                const input = document.createElement('input');
                input.type = q.type;
                input.name = q.id;
                input.value = opt;
                const optLabel = document.createElement('span');
                optLabel.textContent = ` ${opt}`;
                wrapper.appendChild(input);
                wrapper.appendChild(optLabel);
                block.appendChild(wrapper);
            });
        }

        block.appendChild(error);
        form.appendChild(block);
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Submit Survey';
    form.appendChild(submitBtn);
    container.appendChild(form);
    document.body.appendChild(container);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        questions.forEach(q => {
            const block = form.querySelector(`[data-id="${q.id}"]`);
            const errorElement = document.getElementById(`error-${q.id}`);
            let errorMessage = "";

            if (q.type === 'text') {
                const input = form.querySelector(`input[name="${q.id}"]`);
                if (q.required && input.value.trim() === "") {
                    errorMessage = "This field is required.";
                } else if (q.minLength && input.value.length < q.minLength) {
                    errorMessage = `Minimum ${q.minLength} characters required.`;
                }
            } else if (q.type === 'radio') {
                const checked = form.querySelector(`input[name="${q.id}"]:checked`);
                if (q.required && !checked) {
                    errorMessage = "Please select an option.";
                }
            } else if (q.type === 'checkbox') {
                const checkedCount = form.querySelectorAll(`input[name="${q.id}"]:checked`).length;
                if (q.required && checkedCount === 0) {
                    errorMessage = "Please select at least one option.";
                } else if (q.minSelection && checkedCount < q.minSelection) {
                    errorMessage = `Please select at least ${q.minSelection} options.`;
                }
            }

            if (errorMessage) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
                isValid = false;
            } else {
                errorElement.style.display = 'none';
            }
        });

        if (isValid) {
            alert('Survey submitted successfully!');
            form.reset();
        }
    });
})();