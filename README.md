# 🌿 CropGuardian: AI-Powered Agricultural Assistant

**CropGuardian** is a state-of-the-art mobile-first web application designed to empower farmers with real-time threat detection and intelligent crop management. Built with **Next.js** and **TensorFlow.js**, it brings advanced computer vision directly to the farmer's smartphone.

---

## 🚀 Key Features

### 🔍 Real-Time AI Scanner
*   **Intelligent Detection**: Uses the **COCO-SSD** neural network to identify cattle (cows, horses, sheep) and potential pests in real-time.
*   **Live Overlays**: High-speed bounding boxes with confidence scores and "Threat Detected" visual alerts.
*   **Privacy-First**: Runs entirely in the browser, ensuring data stays on the device.

### 📱 Mobile-First Native Experience
*   **Modern Agritech UI**: A premium interface featuring glassmorphism, earthy forest tones, and clean typography.
*   **Bottom Navigation**: Optimized for one-handed operation in the field.
*   **Responsive Dashboard**: At-a-glance status of farm health, active threats, and system vitals.

### 📚 Comprehensive Pest Wiki
*   **Expert Knowledge**: A searchable directory of common agricultural pests (Locusts, Fall Armyworms, Aphids).
*   **Actionable Solutions**: Identification guides, threat levels, and both organic and standard prevention methods.

### 📜 Smart Alert History
*   **Audit Trail**: Logs every detection with precise timestamps and sector locations for long-term monitoring.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
*   **Language**: JavaScript (ES6+)
*   **AI Engine**: [TensorFlow.js](https://www.tensorflow.org/js) + [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Styling**: Custom CSS (Modern Agritech Theme)

---

## 🏗️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed on your system.

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Cattle-Detection-Project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the app**:
   Open [http://localhost:3000](http://localhost:3000) on your mobile device or browser.

---

## 🚜 Future Roadmap

- [ ] **PWA Integration**: Add offline support and "Install to Home Screen" functionality.
- [ ] **Localized Language Support**: Translate the Wiki into regional languages for broader accessibility.
- [ ] **Weather Integration**: Live sensor data for humidity and soil moisture.
- [ ] **Custom Pests Base**: Fine-tuning detection for region-specific insects using transfer learning.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ for the farming community.**
