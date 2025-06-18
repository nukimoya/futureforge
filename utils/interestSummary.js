module.exports = function generateInterestSummary(responses) {
    const interests = {
      tech: 0,
      art: 0,
      leadership: 0,
      science: 0,
      business: 0
    };
  
    for (const r of responses) {
        const content = `${r.question} ${r.answer}`.toLowerCase();
      
        // Technology & Programming
        if (
          content.includes('code') || content.includes('build apps') || content.includes('develop') ||
          content.includes('program') || content.includes('software') || content.includes('website') ||
          content.includes('automation') || content.includes('debug') || content.includes('ai') ||
          content.includes('machine learning') || content.includes('cloud')
        ) {
          interests.tech++;
        }
      
        // Arts & Design
        if (
          content.includes('draw') || content.includes('design') || content.includes('create art') ||
          content.includes('paint') || content.includes('illustrate') || content.includes('graphics') ||
          content.includes('sketch') || content.includes('animation') || content.includes('aesthetic')
        ) {
          interests.art++;
        }
      
        // Leadership & Management
        if (
          content.includes('lead') || content.includes('organize people') || content.includes('manage') ||
          content.includes('coordinate') || content.includes('mentor') || content.includes('team leader') ||
          content.includes('initiative') || content.includes('decision making') || content.includes('supervise')
        ) {
          interests.leadership++;
        }
      
        // Science & Research
        if (
          content.includes('experiment') || content.includes('hypothesis') || content.includes('research') ||
          content.includes('analyze') || content.includes('laboratory') || content.includes('scientific') ||
          content.includes('biology') || content.includes('chemistry') || content.includes('physics')
        ) {
          interests.science++;
        }
      
        // Business & Entrepreneurship
        if (
          content.includes('profit') || content.includes('sales') || content.includes('startup') ||
          content.includes('business') || content.includes('entrepreneur') || content.includes('market') ||
          content.includes('pitch') || content.includes('customer') || content.includes('finance') ||
          content.includes('investment') || content.includes('revenue') || content.includes('brand')
        ) {
          interests.business++;
        }
    }
  
    const top = Object.entries(interests).sort((a, b) => b[1] - a[1])[0];
  
    switch (top?.[0]) {
      case 'tech': return "You enjoy working with technology and solving technical problems.";
      case 'art': return "You enjoy creative activities like design, art, or storytelling.";
      case 'leadership': return "You like taking initiative and organizing people or projects.";
      case 'science': return "You are curious about how things work and enjoy scientific thinking.";
      case 'business': return "You are interested in entrepreneurship, business, and commerce.";
      default: return "You have a variety of interests across multiple domains.";
    }
} 