export enum GoalCategory {
    Reading = 'Reading',
    Movement = 'Movement',
    SelfCare = 'Self-Care',
    Engagement = 'Engagement',
    Ultimate = 'Ultimate',
}

export interface MicroGoal {
    id?: number;
    text: string;
    category: GoalCategory;
}

export interface AnalysisQuestion {
    question: string;
    options: string[];
}

export interface AnalysisFeedback {
    humorous: string;
    serious: string;
}
