import React from 'react';
import ServiceIcon from '../components/ui/ServiceIcons';
import Loader from '../components/ui/Loader';

export const TestComponentsPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a2e', 
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1>Component Test Page</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Service Icons Test</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ServiceIcon service="gmail" size={32} />
            <span>Gmail</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ServiceIcon service="slack" size={32} />
            <span>Slack</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ServiceIcon service="discord" size={32} />
            <span>Discord</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ServiceIcon service="github" size={32} />
            <span>GitHub</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ServiceIcon service="aws-lambda" size={32} />
            <span>AWS Lambda</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Loader Test</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <h3>Small Loader (20px)</h3>
            <div style={{ width: '20px', height: '20px' }}>
              <Loader />
            </div>
          </div>
          <div>
            <h3>Medium Loader (40px)</h3>
            <div style={{ width: '40px', height: '40px' }}>
              <Loader />
            </div>
          </div>
          <div>
            <h3>Large Loader (60px)</h3>
            <div style={{ width: '60px', height: '60px' }}>
              <Loader />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Agent Node Test</h2>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          flexWrap: 'wrap',
          padding: '20px',
          backgroundColor: '#2a2a3e',
          borderRadius: '8px'
        }}>
          <div style={{
            minWidth: '200px',
            maxWidth: '300px',
            backgroundColor: '#1a1a2e',
            border: '2px solid #EA4335',
            borderRadius: '12px',
            padding: '16px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ServiceIcon service="gmail" size={20} />
              <span style={{ fontWeight: '600', color: 'white' }}>Gmail Agent</span>
            </div>
            <div style={{
              backgroundColor: '#FCE8E6',
              color: '#EA4335',
              padding: '4px 8px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '12px'
            }}>
              Gmail
            </div>
          </div>

          <div style={{
            minWidth: '200px',
            maxWidth: '300px',
            backgroundColor: '#1a1a2e',
            border: '2px solid #4A154B',
            borderRadius: '12px',
            padding: '16px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ServiceIcon service="slack" size={20} />
              <span style={{ fontWeight: '600', color: 'white' }}>Slack Agent</span>
            </div>
            <div style={{
              backgroundColor: '#F4E4F6',
              color: '#4A154B',
              padding: '4px 8px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '12px'
            }}>
              Slack
            </div>
          </div>

          <div style={{
            minWidth: '200px',
            maxWidth: '300px',
            backgroundColor: '#1a1a2e',
            border: '2px solid #FFB800',
            borderRadius: '12px',
            padding: '16px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '20px', height: '20px' }}>
                <Loader />
              </div>
              <span style={{ fontWeight: '600', color: 'white' }}>Running Agent</span>
            </div>
            <div style={{
              backgroundColor: '#FFF4E6',
              color: '#FFB800',
              padding: '4px 8px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '12px'
            }}>
              Running
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponentsPage;





