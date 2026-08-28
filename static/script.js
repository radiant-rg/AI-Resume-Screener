// ============================================================
// ELEMENTS
// ============================================================

const resumeFiles =
    document.getElementById("resumeFiles");

const uploadArea =
    document.getElementById("uploadArea");

const uploadInfo =
    document.getElementById("uploadInfo");

const fileCount =
    document.getElementById("fileCount");

const fileList =
    document.getElementById("fileList");

const clearFiles =
    document.getElementById("clearFiles");

const jobDescription =
    document.getElementById("jobDescription");

const screenButton =
    document.getElementById("screenButton");

const loading =
    document.getElementById("loading");

const errorBox =
    document.getElementById("error");

const results =
    document.getElementById("results");


// ============================================================
// SELECTED FILES
// ============================================================

let selectedFiles = [];


// ============================================================
// NORMAL FILE SELECTION
// ============================================================

resumeFiles.addEventListener(
    "change",
    function () {

        addFiles(
            Array.from(resumeFiles.files)
        );

        // Reset input so the same file can
        // be selected again later.
        resumeFiles.value = "";

    }
);


// ============================================================
// DRAG ENTER
// ============================================================

uploadArea.addEventListener(
    "dragenter",
    function (event) {

        event.preventDefault();

        uploadArea.classList.add(
            "dragging"
        );

    }
);


// ============================================================
// DRAG OVER
// ============================================================

uploadArea.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadArea.classList.add(
            "dragging"
        );

    }
);


// ============================================================
// DRAG LEAVE
// ============================================================

uploadArea.addEventListener(
    "dragleave",
    function (event) {

        event.preventDefault();

        uploadArea.classList.remove(
            "dragging"
        );

    }
);


// ============================================================
// DROP
// ============================================================

uploadArea.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        uploadArea.classList.remove(
            "dragging"
        );


        const files =
            Array.from(
                event.dataTransfer.files
            );


        addFiles(files);

    }
);


// ============================================================
// ADD FILES
// ============================================================

function addFiles(files) {

    for (const file of files) {

        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        // Only PDF and DOCX

        if (
            extension !== "pdf" &&
            extension !== "docx"
        ) {

            showError(
                `${file.name} is not a PDF or DOCX file.`
            );

            continue;

        }


        // Maximum 100

        if (
            selectedFiles.length >= 100
        ) {

            showError(
                "Maximum 100 resumes allowed."
            );

            break;

        }


        // Duplicate check

        const duplicate =
            selectedFiles.some(
                existing =>

                    existing.name === file.name &&

                    existing.size === file.size &&

                    existing.lastModified ===
                    file.lastModified
            );


        if (!duplicate) {

            selectedFiles.push(file);

        }

    }


    renderFiles();

    clearError();

}


// ============================================================
// RENDER FILES
// ============================================================

function renderFiles() {

    fileList.innerHTML = "";


    fileCount.textContent =
        selectedFiles.length;


    // --------------------------------------------------------
    // SHOW / HIDE CLEAR ALL
    // --------------------------------------------------------

    if (
        selectedFiles.length > 0
    ) {

        uploadInfo.style.display =
            "flex";

    }
    else {

        uploadInfo.style.display =
            "none";

    }


    // --------------------------------------------------------
    // CREATE FILE ITEMS
    // --------------------------------------------------------

    selectedFiles.forEach(
        (file, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "file-item";


            const left =
                document.createElement(
                    "div"
                );

            left.className =
                "file-left";


            const icon =
                document.createElement(
                    "div"
                );

            icon.className =
                "file-icon";


            if (
                file.name
                    .toLowerCase()
                    .endsWith(".pdf")
            ) {

                icon.textContent =
                    "📕";

            }
            else {

                icon.textContent =
                    "📘";

            }


            const details =
                document.createElement(
                    "div"
                );

            details.className =
                "file-details";


            const name =
                document.createElement(
                    "span"
                );

            name.className =
                "file-name";

            name.textContent =
                file.name;


            const size =
                document.createElement(
                    "span"
                );

            size.className =
                "file-size";

            size.textContent =
                formatFileSize(
                    file.size
                );


            details.appendChild(name);

            details.appendChild(size);


            left.appendChild(icon);

            left.appendChild(details);


            // ------------------------------------------------
            // REMOVE BUTTON
            // ------------------------------------------------

            const remove =
                document.createElement(
                    "button"
                );

            remove.type =
                "button";

            remove.className =
                "remove-file";

            remove.textContent =
                "×";

            remove.title =
                "Remove resume";


            remove.addEventListener(
                "click",
                function () {

                    selectedFiles.splice(
                        index,
                        1
                    );

                    renderFiles();

                }
            );


            item.appendChild(left);

            item.appendChild(remove);


            fileList.appendChild(item);

        }
    );

}


// ============================================================
// CLEAR ALL
// ============================================================

clearFiles.addEventListener(
    "click",
    function () {

        selectedFiles = [];

        resumeFiles.value = "";

        renderFiles();

    }
);


// ============================================================
// FILE SIZE
// ============================================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }


    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1)
            + " KB"
        );

    }


    return (
        (bytes / (1024 * 1024)).toFixed(1)
        + " MB"
    );

}


// ============================================================
// SCREEN BUTTON
// ============================================================

screenButton.addEventListener(
    "click",
    screenCandidates
);


// ============================================================
// SCREEN CANDIDATES
// ============================================================

async function screenCandidates() {

    clearError();


    const jd =
        jobDescription.value.trim();


    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (!jd) {

        showError(
            "Please enter a job description."
        );

        return;

    }


    if (
        selectedFiles.length === 0
    ) {

        showError(
            "Please upload at least one resume."
        );

        return;

    }


    // --------------------------------------------------------
    // FORM DATA
    // --------------------------------------------------------

    const formData =
        new FormData();


    formData.append(
        "job_description",
        jd
    );


    selectedFiles.forEach(
        file => {

            formData.append(
                "resumes",
                file
            );

        }
    );


    // --------------------------------------------------------
    // LOADING
    // --------------------------------------------------------

    screenButton.disabled =
        true;

    screenButton.innerHTML =
        "✦ Screening Candidates...";


    loading.classList.remove(
        "hidden"
    );


    results.classList.add(
        "hidden"
    );


    try {

        const response =
            await fetch(
                "/screen",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Something went wrong while screening resumes."
            );

        }


        displayResults(data);

    }


    catch (error) {

        console.error(error);

        showError(
            error.message
        );

    }


    finally {

        screenButton.disabled =
            false;

        screenButton.innerHTML =
            "✦ Screen Candidates";


        loading.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayResults(data) {

    results.classList.remove(
        "hidden"
    );


    const job =
        data.job || {};


    // Job role

    document.getElementById(
        "jobRole"
    ).textContent =
        job.role ||
        "Not specified";


    // Experience

    document.getElementById(
        "minimumExperience"
    ).textContent =

        job.minimum_experience !== null &&
        job.minimum_experience !== undefined

            ? job.minimum_experience + " years"

            : "Not specified";


    // Skills

    renderTags(
        "requiredSkills",
        job.required_skills || []
    );


    renderTags(
        "preferredSkills",
        job.preferred_skills || []
    );


    // Education

    renderList(
        "educationRequirements",
        job.education_requirements || []
    );


    // Responsibilities

    renderList(
        "responsibilities",
        job.responsibilities || []
    );


    // Candidates

    const candidates =
        data.candidates || [];


    document.getElementById(
        "candidateCount"
    ).textContent =
        candidates.length;


    document.getElementById(
        "candidateTotal"
    ).textContent =
        candidates.length +
        (
            candidates.length === 1
                ? " candidate"
                : " candidates"
        );


    // Top score

    if (
        candidates.length > 0
    ) {

        document.getElementById(
            "topScore"
        ).textContent =
            candidates[0].score + "%";

    }
    else {

        document.getElementById(
            "topScore"
        ).textContent =
            "0%";

    }


    renderCandidates(
        candidates
    );


    // Scroll to results

    results.scrollIntoView({
        behavior: "smooth"
    });

}


// ============================================================
// RENDER TAGS
// ============================================================

function renderTags(
    elementId,
    items
) {

    const container =
        document.getElementById(
            elementId
        );


    container.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        container.textContent =
            "None";

        return;

    }


    items.forEach(
        item => {

            const tag =
                document.createElement(
                    "span"
                );

            tag.className =
                "tag";

            tag.textContent =
                item;

            container.appendChild(
                tag
            );

        }
    );

}


// ============================================================
// RENDER LIST
// ============================================================

function renderList(
    elementId,
    items
) {

    const container =
        document.getElementById(
            elementId
        );


    container.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        const li =
            document.createElement(
                "li"
            );

        li.textContent =
            "None";

        container.appendChild(li);

        return;

    }


    items.forEach(
        item => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                item;

            container.appendChild(
                li
            );

        }
    );

}


// ============================================================
// RENDER CANDIDATES
// ============================================================

function renderCandidates(
    candidates
) {

    const container =
        document.getElementById(
            "candidateList"
        );


    container.innerHTML = "";


    if (
        candidates.length === 0
    ) {

        container.innerHTML =
            "<p>No candidates were processed.</p>";

        return;

    }


    candidates.forEach(
        (candidate, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "candidate";


            // ------------------------------------------------
            // TOP
            // ------------------------------------------------

            const top =
                document.createElement(
                    "div"
                );

            top.className =
                "candidate-top";


            const information =
                document.createElement(
                    "div"
                );


            const name =
                document.createElement(
                    "div"
                );

            name.className =
                "candidate-name";

            name.textContent =
                `${index + 1}. ${
                    candidate.name ||
                    "Unknown Candidate"
                }`;


            const file =
                document.createElement(
                    "div"
                );

            file.className =
                "candidate-file";

            file.textContent =
                candidate.resume_file ||
                "";


            information.appendChild(
                name
            );

            information.appendChild(
                file
            );


            // ------------------------------------------------
            // SCORE
            // ------------------------------------------------

            const score =
                document.createElement(
                    "div"
                );

            score.className =
                "score";

            score.textContent =
                candidate.score +
                "%";


            top.appendChild(
                information
            );

            top.appendChild(
                score
            );


            card.appendChild(
                top
            );


            // ------------------------------------------------
            // DETAILS
            // ------------------------------------------------

            const details =
                candidate.details ||
                {};


            const detailsContainer =
                document.createElement(
                    "div"
                );

            detailsContainer.className =
                "candidate-details";


            // ------------------------------------------------
            // MATCHING SKILLS
            // ------------------------------------------------

            const matching =
                document.createElement(
                    "div"
                );


            const matchingTitle =
                document.createElement(
                    "div"
                );

            matchingTitle.className =
                "detail-title";

            matchingTitle.textContent =
                "Matching Skills";


            const matchingTags =
                document.createElement(
                    "div"
                );

            matchingTags.className =
                "skill-tags";


            const matchingSkills =
                details.matching_skills ||
                [];


            matchingSkills.forEach(
                skill => {

                    const tag =
                        document.createElement(
                            "span"
                        );

                    tag.className =
                        "skill";

                    tag.textContent =
                        skill;

                    matchingTags.appendChild(
                        tag
                    );

                }
            );


            if (
                matchingSkills.length === 0
            ) {

                matchingTags.textContent =
                    "None";

            }


            matching.appendChild(
                matchingTitle
            );

            matching.appendChild(
                matchingTags
            );


            // ------------------------------------------------
            // MISSING SKILLS
            // ------------------------------------------------

            const missing =
                document.createElement(
                    "div"
                );


            const missingTitle =
                document.createElement(
                    "div"
                );

            missingTitle.className =
                "detail-title";

            missingTitle.textContent =
                "Missing Important Skills";


            const missingTags =
                document.createElement(
                    "div"
                );

            missingTags.className =
                "skill-tags";


            const missingSkills =
                details.missing_important_skills ||
                [];


            missingSkills.forEach(
                skill => {

                    const tag =
                        document.createElement(
                            "span"
                        );

                    tag.className =
                        "skill missing";

                    tag.textContent =
                        skill;

                    missingTags.appendChild(
                        tag
                    );

                }
            );


            if (
                missingSkills.length === 0
            ) {

                missingTags.textContent =
                    "None";

            }


            missing.appendChild(
                missingTitle
            );

            missing.appendChild(
                missingTags
            );


            detailsContainer.appendChild(
                matching
            );

            detailsContainer.appendChild(
                missing
            );


            card.appendChild(
                detailsContainer
            );


            // ------------------------------------------------
            // EXPERIENCE
            // ------------------------------------------------

            const experience =
                document.createElement(
                    "div"
                );

            experience.className =
                "verdict";


            let experienceText =
                "Not specified";


            if (
                details.experience_requirement_met === true
            ) {

                experienceText =
                    "✓ Requirement met";

            }
            else if (
                details.experience_requirement_met === false
            ) {

                experienceText =
                    "✗ Requirement not met";

            }


            experience.innerHTML =
                `<strong>
                    Experience:
                 </strong>
                 ${experienceText}`;


            card.appendChild(
                experience
            );


            // ------------------------------------------------
            // VERDICT
            // ------------------------------------------------

            const verdict =
                document.createElement(
                    "div"
                );

            verdict.className =
                "verdict";


            verdict.innerHTML =
                `<strong>
                    AI Verdict:
                 </strong>
                 ${
                    details.final_verdict ||
                    "No verdict available."
                 }`;


            card.appendChild(
                verdict
            );


            container.appendChild(
                card
            );

        }
    );

}


// ============================================================
// ERROR
// ============================================================

function showError(message) {

    errorBox.textContent =
        message;

    errorBox.classList.remove(
        "hidden"
    );

}


function clearError() {

    errorBox.textContent =
        "";

    errorBox.classList.add(
        "hidden"
    );

}


// ============================================================
// INITIAL STATE
// ============================================================

renderFiles();