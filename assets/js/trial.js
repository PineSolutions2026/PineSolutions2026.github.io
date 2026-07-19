(function () {
  "use strict";

  // State variables
  var selectedAiType = "창의적 활동";
  var isGenerated = false;

  var topicOptions = {
    "수학": [
      { value: "공통수학 1", text: "공통수학 1 (준비 중)", disabled: true },
      { value: "공통수학 2", text: "공통수학 2 (준비 중)", disabled: true },
      { value: "대수", text: "대수 (준비 중)", disabled: true },
      { value: "미적분 I", text: "미적분 I (준비 중)", disabled: true },
      { value: "확률과 통계", text: "확률과 통계", selected: true },
      { value: "미적분 II", text: "미적분 II (준비 중)", disabled: true },
      { value: "기하", text: "기하 (준비 중)", disabled: true }
    ],
    "영어": [
      "공통영어 1",
      "공통영어 2",
      "기본영어 1",
      "기본영어 2",
      "영어 I",
      "영어 II",
      "독해와 작문",
      "영미문학읽기",
      "영어 발표와 토론",
      "직무 영어",
      "심화 영어",
      "실생활 영어 회화",
      "미디어 영어",
      "세계 문화와 영어"
    ]
  };

  // DOM Elements
  var aiTypeBtns = document.querySelectorAll(".ai-type-btn");
  var generateBtn = document.getElementById("generateBtn");
  var resourcesPanel = document.getElementById("resourcesPanel");
  var panelOverlay = document.getElementById("panelOverlay");
  var overlayText = document.getElementById("overlayText");
  var loaderSpinner = document.getElementById("loaderSpinner");
  var robotGlow = document.getElementById("robotGlow");
  var generationLogs = document.getElementById("generationLogs");

  var subjectSelect = document.getElementById("subjectSelect");
  var gradeSelect = document.getElementById("gradeSelect");
  var difficultySelect = document.getElementById("difficultySelect");
  var topicInput = document.getElementById("topicInput");
  var topicSelect = document.getElementById("topicSelect");
  var topicSelectWrapper = document.getElementById("topicSelectWrapper");

  function getTopic() {
    if (subjectSelect && topicOptions[subjectSelect.value] && topicSelect) {
      return topicSelect.value.trim();
    }
    return topicInput ? topicInput.value.trim() : "";
  }

  // Signup & Success Elements
  var signupModal = document.getElementById("signupModal");
  var previewModal = document.getElementById("previewModal");
  var successModal = document.getElementById("successModal");
  var signupForm = document.getElementById("signupForm");
  var selectedResourceLabel = document.getElementById("selectedResourceLabel");

  // 1. AI Type Selection Toggle
  aiTypeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      aiTypeBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      selectedAiType = btn.getAttribute("data-type");
    });
  });

  // 1.5. Subject select change - toggle between text input and select dropdown
  function updateTopicInputState() {
    if (!subjectSelect || !topicInput || !topicSelectWrapper || !topicSelect) return;
    
    var topicLabel = document.querySelector('label[for="topicInput"]');
    var subject = subjectSelect.value;
    
    if (topicOptions[subject]) {
      topicInput.style.display = "none";
      topicSelectWrapper.style.display = "block";
      if (topicLabel) topicLabel.textContent = "단원/주제 검색:";
      
      // Populate options
      topicSelect.innerHTML = "";
      topicOptions[subject].forEach(function (opt, index) {
        var optionEl = document.createElement("option");
        if (typeof opt === "string") {
          optionEl.value = opt;
          optionEl.textContent = opt;
          if (index === 0) {
            optionEl.selected = true;
          }
        } else {
          optionEl.value = opt.value;
          optionEl.textContent = opt.text;
          if (opt.disabled) {
            optionEl.disabled = true;
          }
          if (opt.selected) {
            optionEl.selected = true;
          }
        }
        topicSelect.appendChild(optionEl);
      });
    } else {
      topicInput.style.display = "block";
      topicSelectWrapper.style.display = "none";
      if (topicLabel) topicLabel.textContent = "단원/주제 검색:";
      
      if (subject === "과학") {
        topicInput.value = "태양계와 별";
      } else {
        topicInput.value = "";
      }
    }
  }

  if (subjectSelect) {
    subjectSelect.addEventListener("change", updateTopicInputState);
    // Run once on load to establish correct state
    updateTopicInputState();
  }

  // 2. Generate Click Simulation
  if (generateBtn) {
    generateBtn.addEventListener("click", function () {
      var topic = getTopic();
      if (!topic) {
        alert("단원/주제명을 입력해 주세요.");
        if (subjectSelect.value === "수학" && topicSelect) {
          topicSelect.focus();
        } else if (topicInput) {
          topicInput.focus();
        }
        return;
      }

      // Start generation sequence
      isGenerated = false;
      resourcesPanel.className = "resources-panel locked"; // ensure locked
      panelOverlay.style.display = "flex";
      panelOverlay.style.opacity = "1";
      overlayText.style.display = "none";
      loaderSpinner.style.display = "block";
      generationLogs.style.display = "block";
      generationLogs.innerHTML = "";

      var logs = [
        "🔍 1. 국가교육과정 성취기준 분석 중...",
        "⚙️ 2. 학년(" + gradeSelect.value + "), 난이도(" + (difficultySelect ? difficultySelect.value : "기초") + ") 및 교과(" + subjectSelect.value + ") 핵심 역량 추출...",
        "🎨 3. AI 융합 유형(" + selectedAiType + ") 맞춤형 교수법 매핑...",
        "🖥️ 4. 수업 PPT 슬라이드 내용 구성 중...",
        "📝 5. 차시별 교수·학습 지도안 세부 아웃라인 작성 중...",
        "📋 6. 평가 루브릭 및 학생 참여형 활동지 생성 완료!"
      ];

      var currentLogIndex = 0;
      var showNextLog = function () {
        if (currentLogIndex < logs.length) {
          var logLine = document.createElement("div");
          logLine.className = "log-line";
          logLine.textContent = logs[currentLogIndex];
          generationLogs.appendChild(logLine);
          generationLogs.scrollTop = generationLogs.scrollHeight;
          currentLogIndex++;
          setTimeout(showNextLog, 600); // Show next log line every 600ms
        } else {
          // Simulation complete
          setTimeout(function () {
            loaderSpinner.style.display = "none";
            resourcesPanel.classList.add("unlocked");
            resourcesPanel.classList.remove("locked");
            isGenerated = true;
          }, 400);
        }
      };

      showNextLog();
    });
  }

  // 3. Modals and Previews Logic
  window.openPreview = function (type) {
    if (!isGenerated) return;

    var topic = getTopic() || "방정식과 함수";
    var subject = subjectSelect.value;
    var grade = gradeSelect.value;
    var previewContent = document.getElementById("previewContent");

    var html = "";
    var difficultyVal = difficultySelect ? difficultySelect.value : "기초";

    if (type === "ppt") {
      html = 
        "<div class='ppt-preview-container'>" +
        "  <div class='ppt-preview-header'>" +
        "    <span class='ppt-preview-tag'>🖥️ 수업 PPT 미리보기</span>" +
        "    <h3>" + topic + " - AI 융합 수업 패키지</h3>" +
        "  </div>" +
        "  <div class='ppt-slides-viewport'>" +
        "    <div class='ppt-slide active' id='slide1'>" +
        "      <div class='slide-inner slide-title-page'>" +
        "        <p class='slide-meta'>" + grade + " " + subject + " (" + difficultyVal + ")</p>" +
        "        <h2>" + topic + "</h2>" +
        "        <p class='slide-subtitle'>AI와 함께 설계하는 창의적 탐구 학습</p>" +
        "        <div class='slide-footer'>PINE Model AI 자동 생성</div>" +
        "      </div>" +
        "    </div>" +
        "    <div class='ppt-slide' id='slide2'>" +
        "      <div class='slide-inner'>" +
        "        <h3>[활동 1] 실생활 문제 탐색</h3>" +
        "        <ul class='slide-bullets'>" +
        "          <li>실생활에서 <strong>" + topic + "</strong>의 쓰임새를 찾아봅시다.</li>" +
        "          <li>모둠별로 관련 사례를 마인드맵으로 시각화합니다.</li>" +
        "          <li>AI 챗봇 비서를 활용해 사례의 타당성을 1차 검증합니다.</li>" +
        "        </ul>" +
        "        <div class='slide-footer'>PINE Model AI 자동 생성 - 슬라이드 2</div>" +
        "      </div>" +
        "    </div>" +
        "    <div class='ppt-slide' id='slide3'>" +
        "      <div class='slide-inner'>" +
        "        <h3>[활동 2] AI 융합 창작 (" + selectedAiType + ")</h3>" +
        "        <ul class='slide-bullets'>" +
        "          <li>선택한 AI 융합 도구를 활용해 프로젝트 산출물을 기획합니다.</li>" +
        "          <li>동료 피드백을 수집하여 작품의 완성도를 보완합니다.</li>" +
        "          <li>성취기준에 도달했는지 자가 체크리스트를 완성합니다.</li>" +
        "        </ul>" +
        "        <div class='slide-footer'>PINE Model AI 자동 생성 - 슬라이드 3</div>" +
        "      </div>" +
        "    </div>" +
        "  </div>" +
        "  <div class='ppt-controls'>" +
        "    <button type='button' class='btn btn-ghost btn-sm' id='prevSlideBtn' disabled>이전</button>" +
        "    <span class='slide-indicator'><strong id='currentSlideNum'>1</strong> / 3</span>" +
        "    <button type='button' class='btn btn-ghost btn-sm' id='nextSlideBtn'>다음</button>" +
        "  </div>" +
        "  <div class='modal-download-cta'>" +
        "    <p>PPT 원본(Editable 템플릿)을 다운로드하여 바로 편집해서 수업에 활용해 보세요!</p>" +
        "    <button type='button' class='btn btn-primary btn-sm' onclick='triggerSignup(\"수업 PPT\")'>PPT 원본 다운로드</button>" +
        "  </div>" +
        "</div>";

      previewContent.innerHTML = html;
      bindSlideControls();
    } 
    else if (type === "eval") {
      html = 
        "<div class='document-preview-container'>" +
        "  <div class='preview-doc-header doc-eval'>" +
        "    <span class='doc-icon'>📋</span>" +
        "    <div>" +
        "      <h3>[과정 중심 평가 루브릭] " + topic + "</h3>" +
        "      <p>" + grade + " · " + subject + " · 난이도: " + difficultyVal + " · AI 융합 유형: " + selectedAiType + "</p>" +
        "    </div>" +
        "  </div>" +
        "  <div class='doc-body-scroll'>" +
        "    <table class='preview-table'>" +
        "      <thead>" +
        "        <tr>" +
        "          <th>평가 기준 요소</th>" +
        "          <th>우수 (상)</th>" +
        "          <th>보통 (중)</th>" +
        "          <th>노력 요함 (하)</th>" +
        "        </tr>" +
        "      </thead>" +
        "      <tbody>" +
        "        <tr>" +
        "          <td><strong>성취기준 달성도</strong></td>" +
        "          <td>" + topic + "과 관련된 기본 개념을 완벽히 이해하고, 이를 교과 외적 실생활 맥락에 창의적으로 응용하여 해결함.</td>" +
        "          <td>" + topic + "의 기초 개념을 올바르게 이해하고 있으며, 주어진 기본 문제를 무난히 해결함.</td>" +
        "          <td>" + topic + "의 성취기준 도달 수준이 다소 부족하며, 개념 이해를 위한 추가 지도가 필요함.</td>" +
        "        </tr>" +
        "        <tr>" +
        "          <td><strong>AI 기술 활용/탐구</strong></td>" +
        "          <td>" + selectedAiType + " 도구를 주도적으로 제어하며, 정보의 선별 및 활용 능력이 탁월함.</td>" +
        "          <td>제시된 AI 활용 가이드에 따라 기본적인 조작을 수행하고, 탐구 결과물을 정리할 수 있음.</td>" +
        "          <td>AI 도구 사용법이 미숙하며 지시 사항 외의 추가적인 탐구 시도가 부족함.</td>" +
        "        </tr>" +
        "        <tr>" +
        "          <td><strong>협업 및 의사소통</strong></td>" +
        "          <td>모둠원 간의 적극적인 교류를 촉진하고, 타인의 의견을 수용하여 최종 산출물의 완성도를 제고함.</td>" +
        "          <td>비교적 모둠원과의 역할을 충실히 분담하여 결과물 제작 과정에 원만하게 기여함.</td>" +
        "          <td>역할 분담 및 협동 작업 태도가 다소 소극적이며, 참여도가 미흡함.</td>" +
        "        </tr>" +
        "      </tbody>" +
        "    </table>" +
        "  </div>" +
        "  <div class='modal-download-cta'>" +
        "    <p>평가 루브릭을 내 한글(HWP)/엑셀 파일로 소장하고 나이스(NEIS)에 바로 연동하세요.</p>" +
        "    <button type='button' class='btn btn-primary btn-sm' onclick='triggerSignup(\"평가 루브릭\")'>평가 루브릭 양식 받기</button>" +
        "  </div>" +
        "</div>";

      previewContent.innerHTML = html;
    }
    else if (type === "guide") {
      html = 
        "<div class='document-preview-container'>" +
        "  <div class='preview-doc-header doc-guide'>" +
        "    <span class='doc-icon'>📄</span>" +
        "    <div>" +
        "      <h3>[교수·학습 지도안] " + topic + " (1차시)</h3>" +
        "      <p>" + grade + " · " + subject + " (" + difficultyVal + ") · 단원 학습 지도 설계 계획</p>" +
        "    </div>" +
        "  </div>" +
        "  <div class='doc-body-scroll'>" +
        "    <div class='guide-summary'>" +
        "      <p><strong>수업 주제:</strong> " + topic + " 개념과 " + selectedAiType + "의 조화</p>" +
        "      <p><strong>핵심 역량:</strong> 창의적 사고 역량, 지식정보처리 역량, 공동체 역량</p>" +
        "    </div>" +
        "    <table class='preview-table guide-table'>" +
        "      <thead>" +
        "        <tr>" +
        "          <th style='width: 15%;'>단계</th>" +
        "          <th style='width: 15%;'>시간</th>" +
        "          <th>교수-학습 활동 주요 내용</th>" +
        "          <th style='width: 25%;'>자료 및 유의점</th>" +
        "        </tr>" +
        "      </thead>" +
        "      <tbody>" +
        "        <tr>" +
        "          <td class='stage-name'><strong>도입</strong></td>" +
        "          <td>10분</td>" +
        "          <td>" +
        "            <ul>" +
        "              <li>선수 학습 확인 및 동기유발 영상 시청</li>" +
        "              <li>오늘 배울 <strong>" + topic + "</strong>의 목표 제시</li>" +
        "              <li>AI 융합 수업을 위한 사전 준비 확인</li>" +
        "            </ul>" +
        "          </td>" +
        "          <td>시청각 자료<br>스마트 기기 준비 상태 점검</td>" +
        "        </tr>" +
        "        <tr>" +
        "          <td class='stage-name'><strong>전개</strong></td>" +
        "          <td>25분</td>" +
        "          <td>" +
        "            <ul>" +
        "              <li>[탐구] 교사의 시범 설명을 바탕으로 한 모둠별 미션 설계</li>" +
        "              <li>[실습] " + selectedAiType + " 개념을 접목한 모둠별 <strong>" + topic + "</strong> 실습 진행</li>" +
        "              <li>중간 피드백 및 결과 보완</li>" +
        "            </ul>" +
        "          </td>" +
        "          <td>1인 1크롬북/태블릿<br><strong>⚠️ 주의:</strong> 인터넷 필터링 확인</td>" +
        "        </tr>" +
        "        <tr>" +
        "          <td class='stage-name'><strong>정리</strong></td>" +
        "          <td>5분</td>" +
        "          <td>" +
        "            <ul>" +
        "              <li>학습 내용 요약 및 피어 리뷰 진행</li>" +
        "              <li>과정 중심 평가 자기 성찰지 작성</li>" +
        "              <li>차시 예고</li>" +
        "            </ul>" +
        "          </td>" +
        "          <td>자기평가지 배포<br>차시 과제 안내</td>" +
        "        </tr>" +
        "      </tbody>" +
        "    </table>" +
        "  </div>" +
        "  <div class='modal-download-cta'>" +
        "    <p>상세 차시별 약안 및 세안(1~4차시 통합 지도안) 패키지를 전부 다운로드하세요.</p>" +
        "    <button type='button' class='btn btn-primary btn-sm' onclick='triggerSignup(\"교수·학습 지도안\")'>지도안 전체 다운로드</button>" +
        "  </div>" +
        "</div>";

      previewContent.innerHTML = html;
    }
    else if (type === "sheet") {
      html = 
        "<div class='document-preview-container'>" +
        "  <div class='preview-doc-header doc-sheet'>" +
        "    <span class='doc-icon'>✍️</span>" +
        "    <div>" +
        "      <h3>[학생 탐구 활동지] " + topic + "</h3>" +
        "      <p>" + grade + " · " + subject + " (" + difficultyVal + ") · " + selectedAiType + " 연계 활동지</p>" +
        "    </div>" +
        "  </div>" +
        "  <div class='doc-body-scroll'>" +
        "    <div class='worksheet-card'>" +
        "      <div class='worksheet-title-section'>" +
        "        <h4>" + topic + " 탐색 및 " + selectedAiType + " 프로젝트 계획서</h4>" +
        "        <div class='worksheet-meta-inputs'>" +
        "          <span>학년: _____</span>" +
        "          <span>반: _____</span>" +
        "          <span>이름: _________</span>" +
        "        </div>" +
        "      </div>" +
        "      <div class='worksheet-question'>" +
        "        <h5>Q1. 우리가 배운 [" + topic + "]의 개념을 직접 설명해 보거나 그림으로 나타내어 보세요.</h5>" +
        "        <div class='worksheet-blank-box' style='height:80px;'>이곳에 자유롭게 작성하세요.</div>" +
        "      </div>" +
        "      <div class='worksheet-question'>" +
        "        <h5>Q2. " + selectedAiType + "를 활용하여 [" + topic + "] 문제 상황을 해결할 수 있는 아이디어를 설계해 보세요.</h5>" +
        "        <div class='worksheet-blank-box' style='height:120px;'>- 프로젝트 제목:<br>- 주요 활용 AI 도구:<br>- 해결 방안 상세 스케치:</div>" +
        "      </div>" +
        "    </div>" +
        "  </div>" +
        "  <div class='modal-download-cta'>" +
        "    <p>수정이 용이한 HWP/Word 포맷의 깔끔한 인쇄용 학생 활동지를 바로 받아보세요.</p>" +
        "    <button type='button' class='btn btn-primary btn-sm' onclick='triggerSignup(\"학생 활동지\")'>활동지 한글파일 받기</button>" +
        "  </div>" +
        "</div>";

      previewContent.innerHTML = html;
    }

    if (previewModal) {
      previewModal.classList.add("open");
    }
  };

  window.closePreview = function () {
    if (previewModal) {
      previewModal.classList.remove("open");
    }
  };

  // 4. Slide Show Controller
  var bindSlideControls = function () {
    var slides = document.querySelectorAll(".ppt-slide");
    var prevBtn = document.getElementById("prevSlideBtn");
    var nextBtn = document.getElementById("nextSlideBtn");
    var currentSlideNum = document.getElementById("currentSlideNum");
    var currentIndex = 0;

    if (!prevBtn || !nextBtn) return;

    var updateSlide = function (index) {
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("active", idx === index);
      });
      currentIndex = index;
      currentSlideNum.textContent = index + 1;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;
    };

    prevBtn.addEventListener("click", function () {
      if (currentIndex > 0) {
        updateSlide(currentIndex - 1);
      }
    });

    nextBtn.addEventListener("click", function () {
      if (currentIndex < slides.length - 1) {
        updateSlide(currentIndex + 1);
      }
    });
  };

  // 5. Signup Modal Triggers
  window.triggerSignup = function (resourceName) {
    closePreview();
    openSignupModal(resourceName);
  };

  window.openSignupModal = function (resourceName) {
    var resourceText = resourceName || "수업 패키지 4종 전체";
    if (selectedResourceLabel) {
      selectedResourceLabel.textContent = "'" + resourceText + "'";
    }
    if (signupModal) {
      signupModal.classList.add("open");
    }
  };

  window.closeSignupModal = function () {
    if (signupModal) {
      signupModal.classList.remove("open");
    }
  };

  // 6. Signup Form Submit (Mock Backend)
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("userName").value;
      var school = document.getElementById("schoolName").value;
      var email = document.getElementById("userEmail").value;
      var phone = document.getElementById("userPhone").value;

      var topic = getTopic() || "방정식과 함수";
      var subject = subjectSelect.value;
      var grade = gradeSelect.value;

      // Close signup modal
      closeSignupModal();

      // Set values on success modal
      document.getElementById("recName").textContent = name;
      document.getElementById("recSchool").textContent = school;
      document.getElementById("recEmail").textContent = email;
      document.getElementById("recTopic").textContent = topic;
      document.getElementById("recSubject").textContent = subject;
      document.getElementById("recGrade").textContent = grade;
      var recDifficulty = document.getElementById("recDifficulty");
      if (recDifficulty && difficultySelect) {
        recDifficulty.textContent = difficultySelect.value;
      }

      // Open Success modal
      if (successModal) {
        successModal.classList.add("open");
      }
    });
  }
})();
