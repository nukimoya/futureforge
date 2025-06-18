module.exports = function generatePersonalityProfile(responses) {
    const traits = {
      introvert: 0,
      extrovert: 0,
      analytical: 0,
      creative: 0,
      detailOriented: 0,
      spontaneous: 0
    };
  
    for (const r of responses) {
        const q = r.question.toLowerCase();
        const a = r.answer.toLowerCase();
      
        // Introversion
        if (
          q.includes('work alone') || a.includes('alone') || a.includes('independent') ||
          a.includes('by myself') || a.includes('quiet') || a.includes('private') ||
          a.includes('reserved') || a.includes('low social energy')
        ) {
          traits.introvert++;
        }
      
        // Extroversion
        if (
          q.includes('work with others') || a.includes('team') || a.includes('group') ||
          a.includes('collaborate') || a.includes('social') || a.includes('outgoing') ||
          a.includes('talk') || a.includes('communicate with people')
        ) {
          traits.extrovert++;
        }
      
        // Analytical / Logical Thinking
        if (
          a.includes('logic') || a.includes('solve') || q.includes('problem') || a.includes('analyze') ||
          a.includes('critical thinking') || a.includes('structured') || a.includes('data') ||
          a.includes('facts') || a.includes('reasoning') || a.includes('patterns')
        ) {
          traits.analytical++;
        }
      
        // Creativity / Imagination
        if (
          a.includes('design') || a.includes('imagine') || a.includes('innovate') || a.includes('brainstorm') ||
          a.includes('original') || a.includes('creative') || a.includes('visualize') || a.includes('invent') ||
          a.includes('artistic') || a.includes('expression')
        ) {
          traits.creative++;
        }
      
        // Detail-Oriented / Precision
        if (
          a.includes('precise') || a.includes('details') || a.includes('accuracy') || a.includes('focus') ||
          a.includes('meticulous') || a.includes('organized') || a.includes('thorough') ||
          a.includes('structure') || a.includes('neat') || a.includes('systematic')
        ) {
          traits.detailOriented++;
        }
      
        // Spontaneity / Flexibility
        if (
          a.includes('last minute') || a.includes('spontaneous') || a.includes('flexible') ||
          a.includes('improvise') || a.includes('go with the flow') || a.includes('on the spot') ||
          a.includes('impulsive') || a.includes('adapt') || a.includes('instinctive')
        ) {
          traits.spontaneous++;
        }
    }
      
  
    let summary = "You have a ";
  
    summary += traits.introvert > traits.extrovert ? "more introverted" : "more extroverted";
    summary += ", ";
    summary += traits.analytical > traits.creative ? "analytical" : "creative";
    summary += " mindset, and you tend to be ";
    summary += traits.detailOriented > traits.spontaneous ? "detail-oriented." : "flexible and spontaneous.";
  
    return summary;
} 