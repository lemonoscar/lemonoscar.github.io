window.PAPER_READING_DATA = {
    categories: {
        "reinforcement-learning": {
            title: "Reinforcement Learning",
            short: "RL",
            description:
                "Policy learning, sim2real transfer, controller design, locomotion, manipulation, and RL-driven adaptation.",
            page: "paper-reading-reinforcement-learning.html",
            accent: "rl"
        },
        vla: {
            title: "VLA",
            short: "VLA",
            description:
                "Vision-language-action models, multimodal robot policies, benchmarks, action heads, and scaling behavior.",
            page: "paper-reading-vla.html",
            accent: "vla"
        },
        worldmodel: {
            title: "World Models",
            short: "WM",
            description:
                "Latent dynamics, imagined rollouts, semantic planning, world simulation, and future-state reasoning.",
            page: "paper-reading-worldmodel.html",
            accent: "wm"
        },
        misc: {
            title: "Misc",
            short: "Misc",
            description:
                "Benchmarks, navigation systems, data infrastructure, aerial robotics, and adjacent readings around the main stack.",
            page: "paper-reading-misc.html",
            accent: "misc"
        }
    },
    articles: [
        { title: "Attention-Based Map Encoding for Learning Generalized Legged Locomotion", file: "paper/articles/attention-map-encoding.md", category: "reinforcement-learning" },
        { title: "D4RL: Datasets for Deep Data-Driven Reinforcement Learning", file: "paper/articles/d4rl.md", category: "reinforcement-learning" },
        { title: "Learning Agile and Dynamic Motor Skills for Legged Robots", file: "paper/articles/learning-agile-and-dynamic.md", category: "reinforcement-learning" },
        { title: "Motion Priors Reimagined: Adapting Flat-Terrain Skills for Complex Quadruped Mobility", file: "paper/articles/motion-priors-reimagined.md", category: "reinforcement-learning" },
        { title: "Residual Reinforcement Learning for Robot Control", file: "paper/articles/residual-reinforcement-learning-for.md", category: "reinforcement-learning" },
        { title: "RoboDuet: Learning a Cooperative Policy for Whole-body Legged Loco-Manipulation", file: "paper/articles/roboduet.md", category: "reinforcement-learning" },
        { title: "SimpleVLA-RL: Scaling VLA Training via Reinforcement Learning", file: "paper/articles/simplevla-rl.md", category: "reinforcement-learning" },
        { title: "SRPO: Self-Referential Policy Optimization for Vision-Language-Action Models", file: "paper/articles/srpo.md", category: "reinforcement-learning" },
        { title: "TGRPO: Fine-tuning Vision-Language-Action Model via Trajectory-wise Group Relative Policy Optimization", file: "paper/articles/tgrpo.md", category: "reinforcement-learning" },
        { title: "UMI on Legs: Making Manipulation Policies Mobile with Manipulation-Centric Whole-body Controllers", file: "paper/articles/umi-on-legs.md", category: "reinforcement-learning" },
        { title: "Visual Whole-Body Control for Legged Loco-Manipulation", file: "paper/articles/visual-whole-body-control.md", category: "reinforcement-learning" },

        { title: "Benchmarking Vision, Language, & Action Models on Robotic Learning Tasks", file: "paper/articles/benchmarking-vla-models.md", category: "vla" },
        { title: "GEN-0: Embodied Foundation Models That Scale with Physical Interaction", file: "paper/articles/gen-0.md", category: "vla" },
        { title: "InternVLA-M1: A Spatially Guided Vision-Language-Action Framework for Generalist Robot Policy", file: "paper/articles/internvla-m1.md", category: "vla" },
        { title: "NanoVLA: Routing Decoupled Vision-Language Understanding for Nano-sized Generalist Robotic Policies", file: "paper/articles/nanovla.md", category: "vla" },
        { title: "Octo: An Open-Source Generalist Robot Policy", file: "paper/articles/octo.md", category: "vla" },
        { title: "OpenVLA: An Open-Source Vision-Language-Action Model", file: "paper/articles/openvla.md", category: "vla" },
        { title: "pi0: A Vision-Language-Action Flow Model for General Robot Control", file: "paper/articles/pi0.md", category: "vla" },
        { title: "pi0.5: A Vision-Language-Action Model with Open-World Generalization", file: "paper/articles/pi0-5.md", category: "vla" },
        { title: "QUAR-VLA: Vision-Language-Action Model for Quadruped Robots", file: "paper/articles/quar-vla.md", category: "vla" },
        { title: "RT-1: Robotics Transformer for Real-World Control at Scale", file: "paper/articles/rt-1.md", category: "vla" },
        { title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", file: "paper/articles/rt-2.md", category: "vla" },
        { title: "ReconVLA: Reconstructive Vision-Language-Action Model as Effective Robot Perceiver", file: "paper/articles/reconvla.md", category: "vla" },
        { title: "Vision-Language-Action Models for Robotics: A Review Towards Real-World Applications", file: "paper/articles/vla-review.md", category: "vla" },
        { title: "VLABench: A Large-Scale Benchmark for Language-Conditioned Robotics Manipulation with Long-Horizon Reasoning Tasks", file: "paper/articles/vlabench.md", category: "vla" },

        { title: "3D-VLA: A 3D Vision-Language-Action Generative World Model", file: "paper/articles/3d-vla.md", category: "worldmodel" },
        { title: "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots", file: "paper/articles/gr00t-n1.md", category: "worldmodel" },
        { title: "Learning Latent Dynamics for Planning from Pixels", file: "paper/articles/learning-latent-dynamics.md", category: "worldmodel" },
        { title: "Mastering Diverse Domains through World Models", file: "paper/articles/mastering-diverse-domains.md", category: "worldmodel" },
        { title: "ODYSSEY: Open-World Quadrupeds Exploration and Manipulation for Long-Horizon Tasks", file: "paper/articles/odyssey.md", category: "worldmodel" },
        { title: "WMPO: World Model-based Policy Optimization for Vision-Language-Action Models", file: "paper/articles/wmpo.md", category: "worldmodel" },

        { title: "ARIO (All Robots in One)", file: "paper/articles/ario-all-robots-in-one.md", category: "misc" },
        { title: "Embodied Agent Interface Blog", file: "paper/articles/embodied-agent-interface.md", category: "misc" },
        { title: "Flying Hand: End-Effector-Centric Framework for Versatile Aerial Manipulation Teleoperation and Policy Learning", file: "paper/articles/flying-hand.md", category: "misc" },
        { title: "Learning Multi-Stage Pick-and-Place with a Legged Mobile Manipulator", file: "paper/articles/legged-pick-place.md", category: "misc" },
        { title: "LIBERO: Benchmarking Knowledge Transfer for Lifelong Robot Learning", file: "paper/articles/libero.md", category: "misc" },
        { title: "Meta-World", file: "paper/articles/meta-world.md", category: "misc" },
        { title: "OpenFly: A Comprehensive Platform for Aerial Vision-Language Navigation", file: "paper/articles/openfly.md", category: "misc" },
        { title: "RLBench: The Robot Learning Benchmark & Learning Environment", file: "paper/articles/rlbench.md", category: "misc" },
        { title: "StreamVLN: Streaming Vision-and-Language Navigation via SlowFast Context Modeling", file: "paper/articles/streamvln.md", category: "misc" },
        { title: "Think Global, Act Local: Dual-scale Graph Transformer for Vision-and-Language Navigation", file: "paper/articles/think-global-act-local.md", category: "misc" },
        { title: "UAV-Flow Colosseo: A Real-World Benchmark for Flying-on-a-Word UAV Imitation Learning", file: "paper/articles/uav-flow-colosseo.md", category: "misc" }
    ],
    imageCount: 75
};
